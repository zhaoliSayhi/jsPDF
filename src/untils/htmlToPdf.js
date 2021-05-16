// 导出页面为PDF格式
import JsPDF from 'jspdf' //  cnpm install jspdf --save
import 'jspdf-autotable' //  cnpm install jspdf-autotable    // 下载完之后要修改源代码，否则表头还是中文乱码
import moo from '../../static/font/font' // 中文字体文件
import { base64Img } from './imgBase64'

const footText = 'Voluptas et tempore non possimus qui blanditiis autem vitae velit nesciunt quos modi dignissimos\n' +
  'molestias tempora harum iure pariatur in odio et accusantium et rerum voluptas aut dicta mollitia\n' +
  'voluptas maiores maxime architecto voluptatem nam quasi eos sapiente quis placeat labore esse est\n' +
  'nemo aut aut et commodi sed consequatur laboriosam.'

const BASE_COLUMNS = [{
  label: '始发城市',
  key: 'beginCity',
  width: 120,
  show: true
}, {
  label: '始发区号',
  key: 'beginAreaCode',
  width: 60,
  show: true
}, {
  label: '目的城市',
  key: 'endCity',
  width: 100,
  show: true
}, {
  label: '目的区号',
  key: 'endAreaCode',
  width: 60,
  show: true
}, {
  label: '收费方式',
  key: 'chargeType',
  width: 50,
  show: true
}, {
  label: '起方',
  key: 'beginWeight',
  width: 30,
  show: true,
  sectionIndex: true,
}, {
  label: '运费最低运费',
  key: 'freightLowestAmount',
  width: 70,
  show: true
}, {
  label: '附加费',
  key: 'surchargeAmount',
  width: 40,
  show: true
}]

export default {
  install(Vue, options) {
    Vue.prototype.getPdfTable = function (dom, titles) {
      console.time('download')
      const doc = new JsPDF('p', 'pt') // 获取实例
      const res = doc.autoTableHtmlToJson(document.getElementById("basic-table"))
      // ===============================  设置字体
      doc.addFileToVFS('pingfang.ttf', moo)
      doc.addFont('pingfang.ttf', 'b', 'normal')
      doc.setFont('b')

      let bodyData = res.data

      doc.addImage(base64Img, 'JPEG', 0, 0)

      const columnsData = BASE_COLUMNS.map(item => {
        return {
          dataKey: item.key,
          header: item.label
        }
      })

      const colStyles = {}
      BASE_COLUMNS.forEach((col, index) => {
        colStyles[index] = {cellWidth: col.width}
      })

      doc.autoTable({
        styles: {
          fillColor: [255, 255, 255],
          font: 'b',
          fontStyle: 'normal',
          textColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
          margin: {
            horizontal: 7,
          }
        },
        theme: 'grid',
        body: bodyData,
        columns: columnsData,
        headStyles: {
          fontSize: 10,
          // fillColor: [250, 152, 95],
          lineWidth: 0.1
        },
        bodyStyles: {
          fontSize: 10
        },
        tableWidth: 'auto',
        startY: 100,
        rowPageBreak: 'avoid', // 分页一行数据不截断
        columnStyles: colStyles,
      })

      doc.addImage(base64Img, 'JPEG', 0, doc.lastAutoTable.finalY + 10)

      doc.setTextColor(100)
      doc.setFontSize(11)
      doc.text(footText, 14, doc.lastAutoTable.finalY + 180)

      doc.save("table.pdf")

      console.timeEnd('download')
    }
  }
}

