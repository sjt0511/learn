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
      v-model:modelValue="tab.active"
      :list="tab.data"
      @doTab="init"
    ></comp-tab>
    <p>{{ matrix_info }}</p>
    <ul class="test-index_matrix">
      <li v-for="(row, index) in matrix" :key="index" class="test-index_row">
        <item-cell v-for="(cell, cindex) in row" v-model.modelValue="row[cindex]"
                   :key="cindex" @speadOpen="spreadOpen(index, cindex)"></item-cell>
      </li>
    </ul>
  </div>
  <footer>hhh</footer>
</template>

<script>
import { reactive, computed } from "vue";
import CompTab from "../../components/CompTab.vue";
import ItemCell from './components/ItemCell.vue';
export default {
  components: { CompTab, ItemCell },
  name: "TestIndex",
  setup() {
    const tab = reactive({
      data: [
        { label: "初级 9*9 10雷", value: 1, num: 10, m: 9, n: 9, mn: 81 },
        { label: "中级 12*9 20雷", value: 2, num: 20, m: 12, n: 9, mn: 108 },
      ],
      active: "",
    });

    let matrix = reactive([]);

    let matrix_info = computed(function () {
      let all = 0
      let find = 0
      matrix.forEach(row => {
          row.forEach(cell => {
              if (cell.value > 8) all++
              if (cell.value > 8 && isFinite(cell)) find++ // 标成9就是找到了
          })
      })
      return {
        find,
        all
      };
    });

    // 递归翻开 对于每一个已翻开数字，要去看它周围的一圈炸弹是不是足够了，足够了就翻开周围那些没翻开的
    const spreadOpen = function (row, column) {
      console.log(row, column)
    }

    // 初始化
    const init = function (value) {
      tab.active = value;
      const find = tab.data.find((x) => x.value === value);
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
            // 有上排
            if (row - 1 >= 0) {
              if (column - 1 >= 0) {
                // 上左
                matrix[row - 1][column - 1].value++;
              }
              matrix[row - 1][column].value++; // 上中
              if (column + 1 < find.n) {
                // 上右
                matrix[row - 1][column + 1].value++;
              }
            }
            // 中排一定有
            if (column - 1 >= 0) {
              // 中左
              matrix[row][column - 1].value++;
            }
            if (column + 1 < find.n) {
              // 中右
              matrix[row][column + 1].value++;
            }
            // 有下排
            if (row + 1 < find.m) {
              if (column - 1 >= 0) {
                // 下左
                matrix[row + 1][column - 1].value++;
              }
              matrix[row + 1][column].value++;
              if (column + 1 < find.n) {
                // 下右
                matrix[row + 1][column + 1].value++;
              }
            }
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
