<template>
  <div class="hello">
      <button @click="getPdfTable('tableDom' ,'吃的饭')">用autotable导出表格文件pdf</button>

      <table id="basic-table" class="table-style" border="0">
          <thead>
            <tr class="target-node-item">
                <th v-for="(col, index) in tableColumns"
                    :key="index"
                    class="thead-row">
                    {{ col.label }}
                </th>
            </tr>
          </thead>
          <tbody class="node">
            <tr v-for="(item, i) in tableData"
                :key="i"
                class="target-node-item">
                <td v-for="(col, index) in tableColumns"
                    :key="index"
                    class="tbody-row">
                    {{ item[col.key] }}
                </td>
            </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
    // v-if="dealRowSpan({rowIndex: i, columnIndex: index}).rowspan !== 0"
    //   :rowSpan="dealRowSpan({rowIndex: i, columnIndex: index}).rowspan"
    import data from './data'
    const BASE_COLUMNS = [{
        label: '始发城市',
        key: 'beginCity',
        width: 120,
        show: true
    }, {
        label: '始发区号',
        key: 'beginAreaCode',
        width: 100,
        show: true
    }, {
        label: '目的城市',
        key: 'endCity',
        width: 120,
        show: true
    }, {
        label: '目的区号',
        key: 'endAreaCode',
        width: 60,
        show: true
    }, {
        label: '收费方式',
        key: 'chargeType',
        width: 60,
        show: true
    }, {
        label: '起方',
        key: 'beginWeight',
        width: 40,
        show: true,
        sectionIndex: true,
    }, {
        label: '运费最低运费',
        key: 'freightLowestAmount',
        width: 90,
        show: true
    }, {
        label: '附加费',
        key: 'surchargeAmount',
        width: 50,
        show: true
    }]
export default {
    name: 'HelloWorld',
    data () {
      return {
          tableColumns: BASE_COLUMNS,
          mergePosArr: [],
          tableData: [],
      }
    },
    created() {
        this.tableData = data.data.customerOfferList
        this.tableData.forEach((item, index) => {
            this.dealMergeRows(this.tableData, index)
        })
    },
    methods: {
        dealMergeRows (data, index) {
            if (index === 0) {
                this.mergePosArr.push(1)
                this.mergePos = 0
            } else {
                if (data[index].beginCity === data[index - 1].beginCity) {
                    this.mergePosArr[this.mergePos] += 1
                    this.mergePosArr.push(0)
                } else {
                    this.mergePosArr.push(1)
                    this.mergePos = index
                }
            }
        },
        dealRowSpan({ rowIndex, columnIndex }) {
            let obj = {
                rowspan: null,
                colspan: null
            }
            if ([0, 1].includes(columnIndex) && this.mergePosArr.length) {
                const _row = this.mergePosArr[rowIndex] || 0
                const _col = _row > 0 ? 1 : 0
                obj.rowspan = _row
                obj.colspan = _col
            }
            return obj
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .table-class {
        background-color: #fff;
        margin: auto;
        padding: 10px;
        box-sizing: border-box;
    }
    .name-style {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .table-style {
        border-collapse: collapse;
        width: 100%;
        text-align: center;
    }
    td,
    th {
        font-size: 14px;
        border: 1px solid #e4e7ed;
    }
    tr {
        word-break: break-all;
        page-break-before: always;
        page-break-after: always;
        page-break-inside: avoid;
    }
    .td-bg {
        padding: 10px 0;
    }
    .thead-row {
        padding: 6px 0;
    }
    .tbody-row {
        word-break : break-all;
    }
</style>

