<!-- Vue3中.vue文件里template里可以没有根标签，Vue3会用一个fragment包起来且不出现在DOM节点上 -->
<template>
  <div class="test-index">
    <!-- TODO: 可以让用户选择难度 -->
    <!-- <ul>
          <li v-for="(item,index) in tab.data" :key="index" @click="init(item.value)">
              {{item.label}}
          </li>
      </ul> -->
    <comp-tab
      v-model="tab.active"
      :list="tab.data"
      @doTab="init"
    ></comp-tab>
    <p>{{ matrix_info.find }} / {{matrix_info.all}}</p>
    <ul class="test-index_matrix">
      <li v-for="(row, index) in matrix" :key="index" class="test-index_row">
        <item-cell v-for="(cell, cindex) in row" v-model.modelValue="row[cindex]"
                   :key="cindex" @open="open(index, cindex)" @spread-open="spreadOpen(index, cindex)"></item-cell>
      </li>
    </ul>
  </div>
  <footer>hhh</footer>
</template>

<script>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router"
import CompTab from "../../components/CompTab.vue";
import ItemCell from './components/ItemCell.vue';

export default {
  components: { CompTab, ItemCell },
  name: "TestIndex",
  props: {
    item: Object
  },
  setup(props) {
    const route = useRoute()
    console.log('props接收item', props.item)
    console.log('this.$route.params', route.params)

    const tab = reactive({
      data: [
        { label: "初级 9*9 10雷", value: 1, num: 10, m: 9, n: 9, mn: 81 },
        { label: "中级 12*9 20雷", value: 2, num: 20, m: 12, n: 9, mn: 108 },
      ],
      active: "",
      activeItem: null
    });

    let matrix = reactive([]);

    let matrix_info = computed(function () {
      let all = 0
      let find = 0
      let opened = 0
      const list = []
      matrix.forEach((row, rindex) => {
          row.forEach((cell, cindex) => {
              if (cell.value > 8) {
                all++
                list.push({ row: rindex, column: cindex })
              }
              if (cell.value > 8 && isFinite(cell.value)) find++ // 标成9就是找到了
              if (cell.open) opened++
          })
      })
      if (find === all) {
        // alert()
      }
      return {
        find,
        all,
        square: tab.activeItem.mn,
        opened,
        list
      };
    });

    // 递归翻开 对于每一个已翻开数字，要去看它周围标的一圈炸弹正确数是不是足够了，足够了就翻开周围那些没翻开的
    // 判断是否在边界内
    const judgeBoundaryWithin = function (row, column) {
      return row >= 0 && row < tab.activeItem.m && column >= 0 && column < tab.activeItem.n
    }
    // 1 查看是不是周围的雷都标出来了
    const matchAllMine = function (row, column) {
      const all = matrix[row][column].value
      let count = 0
      // 看周围是雷的有没有被标出雷
      const judge = (row, column) => {
        if (judgeBoundaryWithin(row,column)) { // 是一个合理的方格
          if (matrix[row][column].value > 8 && matrix[row][column].flag) { // 是个雷并且标成了雷
            matrix[row][column].value = 9
            return 1
          }
        }
        return 0
      }
      count = judge(row - 1, column - 1) + judge(row - 1, column) + judge(row - 1, column + 1) +
              judge(row, column - 1) + judge(row, column + 1) +
              judge(row + 1, column - 1) + judge(row + 1, column) + judge(row + 1, column + 1)
      return count === all
    }
    // 2 翻开某个方格-返回值表示是否要进行递归
    const openAround = function (row, column) {
      // 在边界内&&没插旗&&没翻开
      if (judgeBoundaryWithin(row, column) && !matrix[row][column].flag && !matrix[row][column].open) {
        matrix[row][column].open = true
        return true
      }
      return false
    }
    // 3 递归翻开一片
    const spreadOpen = function (row, column) {
      if (row < 0 || row >= tab.activeItem.m || column < 0 || column >= tab.activeItem.n) { // 到了方格板边界
        return
      }
      if (matchAllMine(row, column)) { // 雷都标出了
        // 翻开周围每个未被插旗的方格并执行递归展开
        openAround(row - 1, column - 1) && spreadOpen(row - 1, column - 1)
        openAround(row - 1, column) && spreadOpen(row - 1, column)
        openAround(row - 1, column + 1) && spreadOpen(row - 1, column + 1)
        openAround(row, column - 1) && spreadOpen(row, column - 1)
        openAround(row, column + 1) && spreadOpen(row, column + 1)
        openAround(row + 1, column - 1) && spreadOpen(row + 1, column - 1)
        openAround(row + 1, column) && spreadOpen(row + 1, column)
        openAround(row + 1, column + 1) && spreadOpen(row + 1, column + 1)
      }
    }

    // 翻开一个方格
    const open = function (row, column) {
      matrix[row][column].open = true
      if (matrix[row][column].value <= 8) { // 安全的-就执行一次递归翻开
        spreadOpen(row, column)
      } else { // 爆炸
        matrix[row][column].err = '爆炸'
        const list = matrix_info.value.list
        for (let i = 0; i <list.length; i++) {
          matrix[list[i].row][list[i].column].open = true
          matrix[list[i].row][list[i].column].explose = true
        }
        alert('失败')
      }
    }

    // 初始化
    // 1 标雷后计算雷数
    const calcMine = (row, column) => {
      if (judgeBoundaryWithin(row, column)) { // 是合理方格
        matrix[row][column].value++
      }
    }
    // 2 主体逻辑
    const init = function (value) {
      tab.active = value;
      const find = tab.data.find((x) => x.value === value);
      tab.activeItem = find
      matrix.length = 0;
      for (let i = 0; i < find.m; i++) {
        const arr = []
        for (let j = 0; j < find.n; j++) {
          arr.push({ value:0, flag: false, open: false })
        }
        matrix[i] = arr
      }
      console.log(matrix)
      // 随机n个雷
      if (find) {
        const mineArr = [];
        for (let i = 0; i < find.num; i++) {
          const random = Math.floor(Math.random() * find.mn);
          const row = Math.floor(random / find.n);
          const column = random % find.n;
          if (!mineArr.some((x) => x === random)) {
            mineArr.push(random)
            // 标雷
            matrix[row][column].value = Infinity;
            // 更新类周围的所有方格
            calcMine(row - 1, column -1)
            calcMine(row - 1, column)
            calcMine(row - 1, column + 1)
            calcMine(row, column - 1)
            calcMine(row, column + 1)
            calcMine(row + 1, column - 1)
            calcMine(row + 1, column)
            calcMine(row + 1, column + 1)
          } else {
              i--
          }
        }
      }
    }

    init(1);

    return {
      tab,
      matrix,
      matrix_info,
      init,
      open,
      spreadOpen
    };
  },
};
</script>

<style lang="scss">
.test-index {
  i {
    font-size: 14px;
  }

  &_matrix {

    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
  }

  &_row {
    display: flex;
  }
}
</style>
