<template>
  <div>
    <el-main>
      <span>注意：当前会战为测试版，命令随时可能发生变更</span><br />
      <el-table
        :data="tableData"
        :height="table_height"
        border
        class="bot-help"
        style="width: 100%; background-color: rgba(255, 255, 255, 0)"
        :cell-style="tableCellStyle"
      >
        <el-table-column prop="command" label="指令" width="180" />
        <el-table-column prop="description" label="说明" />
      </el-table>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          command: "创建台/日服公会",
          description: "创建公会",
        },
        {
          command: "加入公会(@某人)",
          description: "加入公会",
        },
        {
          command: "退出公会",
          description: "退出公会",
        },
        {
          command: "修改昵称 [新昵称](@某人)",
          description: "修改会战昵称",
        },
        {
          command: "报刀(整)[1-5](伤害)(:注释)(@某人)",
          description: "报刀，伤害单位可以使用w,kw,e，如加上整则强制上报为完整刀，否则优先上报为补偿刀",
        },
        {
          command: "尾刀(整)[1-5](:注释)(@某人)",
          description: "收尾刀报刀，如加上整则强制上报为完整刀，否则优先上报为补偿刀",
        },
        {
          command: "状态",
          description: "查看当前公会战状态",
        },
        {
          command: "查[1-5]",
          description: "查看指定boss状态",
        },
        {
          command: "申请(出刀)[1-5](:注释)",
          description: "申请出刀",
        },
        {
          command: "取消申请",
          description: "撤销当前出刀申请",
        },
        {
          command: "出刀表",
          description: "查看当前正在出刀的成员",
        },
        {
          command: "挂树(伤害)(:注释)(@某人)",
          description: "记录挂树，将在boss被击败时通知",
        },
        {
          command: "查树",
          description: "查看当前挂树情况",
        },
        {
          command: "预约[1-5] (周目)(:注释)",
          description: "预约boss，将在boss可以被挑战时通知",
        },
        {
          command: "取消预约[1-5] (周目)",
          description: "取消预约boss",
        },
        {
          command: "撤回(@某人)",
          description: "撤回上次报刀，由于数据库原因仅可撤回最近的一次报刀",
        },
        {
          command: "sl[1-5](:注释)(@某人)",
          description: "记录sl",
        },
        {
          command: "查sl(@某人)",
          description: "查询sl状态",
        },
        {
          command: "设置密码[密码]（仅私聊）",
          description: "设置Web登陆密码",
        },
        {
          command: "刷新会战管理员列表",
          description: "刷新会战管理员列表为当前群组管理员",
        },
        {
          command: "修改公会名称 [新名称]（仅会战管理员）",
          description: "修改公会名称",
        },
        {
          command: "移出公会 [QQ号]（仅会战管理员）",
          description: "将指定QQ号移出公会",
        },
        {
          command: "面板",
          description: "发送Web面板登陆地址",
        },
        {
          command: "帮助",
          description: "发送帮助网页",
        }
      ],
      table_height: "800px"
    };
  },
  created() {
    this.getHeight()
    window.addEventListener('resize', this.getHeight);
  },
  methods: {
    tableCellStyle() {
      return '';
    },
    getHeight() {
      this.table_height = window.innerHeight - 184 + 'px';
    },
  }
};
</script>

<style lang="scss">
.bot-help tr {
  background-color: rgba(255, 255, 255, 0.7) !important;
}
</style>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>