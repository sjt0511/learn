<template>
  <div class="test">
      <label class="test_form">
          <input v-model="form.name">
          <button @click="add">添加</button>
      </label>
      <transition-group class="test_list" tag="ul" name="list">
          <li class="test_item" v-for="(item,index) in list.data" :key="item.id">
              <label><span>{{index+1}}</span>{{item.name}}</label>
              <button @click="remove(item,index)">删除</button>
          </li>
      </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'TestMain',
    data () {
        return {
            form: { name: '', id: 0 },
            list: {
                data: []
            }
        }
    },
    computed: {
        storeName () {
            return this.$store.state.main.name
        },
        ...mapState('main', ['name'])
    },
    methods: {
        add() {
            this.form.id++
            this.list.data.push({ name: this.form.name, id: this.form.id })
            this.form.name = ''
        },
        remove(item,index) {
            this.list.data.splice(index, 1)
        }
    }
}
</script>

<style lang="scss">
.test {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;

    &_form {
        padding: 10px;
    }

    &_list {
        // padding: 10px;
        width: 300px;
        min-height: 200px;
        background: #eee;
        overflow-x: hidden;
    }

    &_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 10px;
        padding: 5px 10px;
        background: pink;

        &:nth-child(odd) {
            background: orange;
        }
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    /* 进入起点，离开终点 */
    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateX(-100%);
    }

    /* 进入终点，离开起点 */
    .list-enter-to, .list-leave {
        // transform: translateX(100%);
        opacity: 1;
    }
}
</style>