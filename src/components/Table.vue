<template>
  <div class="table">
    <vxe-table
      border
      row-id="id"
      ref="xTable"
      show-overflow
      :tree-config="{
        children: 'children',
        expandAll: true,
        toggleMethod: toggleTreeMethod
      }"
      :merge-cells="mergeCells"
      :merge-footer-items="[]"
      :data="treeData"
    >
      <vxe-table-column
        v-for="item in theadData"
        :key="item.id"
        :field="item.field"
        :visible="item.isVisible"
        :tree-node="item.id === 1"
        width="200"
      >
        <template #header>
          <span>{{ item.name }}</span>
          <i
            v-if="item.isChildren"
            :class="
              item.isCollapsable
                ? 'vxe-icon--arrow-left'
                : 'vxe-icon--arrow-right'
            "
            @click="handleCollapsable(item)"
          ></i>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
import data from "@/assets/json/data.json";
import headData from "@/assets/json/head-data.json";

export default {
  data() {
    return {
      mergeCells: [
        // { row: 0, col: 0, rowspan: 3, colspan: 0 },
        // { row: 3, col: 0, rowspan: 3, colspan: 0 }
      ]
    };
  },
  methods: {
    handleCollapsable(item) {
      const xTable = this.$refs.xTable;
      item.isCollapsable = !item.isCollapsable;
      item.children.forEach(_item => {
        const column = xTable.getColumnByField(_item.field);
        column.visible = item.isCollapsable;
      });
      xTable.refreshColumn();
      xTable.setMergeCells(this.mergeCells);
    },
    toggleTreeMethod() {
      // const xTable = this.$refs.xTable;
      // xTable.handleTableData(true);
      // xTable.setMergeCells(this.mergeCells);
      // console.log(xTable.getRowById(row.id));
      // xTable.toggleTreeExpand(row);
      return true;
    }
  },
  created() {
    let count = {};
    this.treeData = XEUtils.mapTree(
      XEUtils.toArrayTree(data, {
        key: "indCode",
        parentKey: "pIndCode"
      }),
      item => {
        if (count[item.indCode]) {
          count[item.indCode]++;
        } else {
          count[item.indCode] = 1;
        }
        return {
          ...item,
          id: `${item.indCode}--${count[item.indCode]}`,
          _key: item.indCode
        };
      }
    );

    let index = {};
    let _num = 0;
    let _count = 0;
    this.treeData = XEUtils.mapTree(this.treeData, item => {
      if (item.children && item.children.length) {
        item.hasChild = true;
      }
      if (item.id !== `${item.indCode}--${count[item.indCode]}`) {
        delete item.children;
      }
      if (index[item.indCode]) {
        _count++;
        index[item.indCode].rowspan = _count;
      } else {
        _count = 1;
        index[item.indCode] = {
          row: _num,
          col: 0,
          rowspan: _count,
          colspan: 0
        };
      }
      _num++;
      return {
        ...item,
        id: `${item.indCode}--${_count}`
      };
    });

    this.mergeCells = XEUtils.toArray(index);

    console.warn("tree", this.treeData);
    this.theadData = XEUtils.toTreeArray(
      XEUtils.mapTree(
        XEUtils.toArrayTree(headData, {
          key: "id",
          parentKey: "pid"
        }),
        item => {
          return {
            ...item,
            isChildren: item.children.length > 0,
            isCollapsable: false,
            isVisible: item.pid === ""
          };
        }
      )
    );
    console.warn("thead", this.theadData);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
