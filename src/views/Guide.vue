<template>
  <div class="home" style="margin-left: 30px">
    <h2 align="left">使用指南</h2>
    <div
      style="
        background-color: rgba(255, 255, 255, 0.7) !important;
        margin-right: 30px;
        font-size:18px;
      "
    >
      <el-collapse>
        <el-collapse-item title="创建公会">
          <div>
            向机器人发送“创建台服公会”来创建公会，默认情况下在大于30人的群中不会自动加入全部成员，如需要加入全部成员可以发送“加入全部成员”来加入，可以从web端快速移除多余成员。
          </div>
        </el-collapse-item>
        <el-collapse-item title="报刀">
          <div>
            发送“报刀1 1300w”来上报对一王造成的1300w的刀，如想在持有补偿刀的情况下优先上报完整刀，可发送“报刀整1 1300w”来上报为完整刀，否则在拥有补偿刀的情况下默认上报为补偿
            刀。发送“尾刀1”来上报击败boss的尾刀，强制上报补偿刀发送“尾刀整1”。如错误报刀可发送“撤销1”来撤销上一次一王的报刀。
          </div>
        </el-collapse-item>
        <el-collapse-item title="预约，申请出刀">
          <div>
            发送“预约1”来预约当前周目1王，发送“预约1 20”来预约20周目的一王。如果你预约的boss当前处于无法挑战的状态，那么当其变为可以挑战时会通过群内at的方式进行通知。<br>
            发送“申请出刀1”来申请出1王刀，注意申请出刀后系统实际上并不会锁定boss，只会在有人正在挑战的时候继续申请时做出提醒，如果已经申请出刀，报刀、挂树时可以省略几王；发送“取消申请”可以解除申请出刀状态，如需更新挂树备注课发送“申请：新备注”来更新备注。
          </div>
        </el-collapse-item>
        <el-collapse-item title="撤销出刀">
          <div>
            发送“撤销1”来撤销最近的对1王的出刀，发送“撤销”来撤回最近的一次出刀，只有管理员，代上报人和本人可以撤销出刀记录
          </div>
        </el-collapse-item>
        <el-collapse-item title="挂树、SL">
          <div>
            发送“挂树1”来在1王上挂树，如已经申请出刀则可以直接发送“挂树”，如需更新挂树备注课发送“挂树：新备注”来更新备注<br>
            发送“SL”来记录当天的SL，SL会清除当前挂树状态
          </div>
        </el-collapse-item>
        <el-collapse-item title="(new) 允许的别名">
          <div>
            申请出刀和申请、进等效<br>
            取消申请和解锁等效
          </div>
        </el-collapse-item>
        <el-collapse-item title="更多">
          <div>
            更多指令请详见<a href="/help">帮助</a>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
