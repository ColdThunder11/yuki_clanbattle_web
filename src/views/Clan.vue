<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <!-- todo 多公会选择框 -->
        <el-dialog
          v-model="chose_clan_dialog_visible"
          title="Tips"
          width="30%"
          :before-close="handleChoseClanClose"
        >
          <span>This is a message</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                type="primary"
                @click="chose_clan_dialog_visible = false"
                >Confirm</el-button
              >
            </span>
          </template>
        </el-dialog>
        <!-- 报刀选择框 -->
        <el-dialog
          v-model="report_record_dialog_visible"
          title="报刀"
          width="50%"
        >
          <el-form :model="report_record_form">
            <el-form-item label="Boss" :label-width="formLabelWidth">
              <el-select
                v-model="report_record_form.target_boss"
                placeholder="请选择挑战的Boss"
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="尾刀" :label-width="formLabelWidth">
              <el-switch v-model="report_record_form.is_kill_boss"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="!report_record_form.is_kill_boss"
              label="伤害"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="report_record_form.damage"
                autocomplete="off"
                @keyup.enter="reportRecord"
              ></el-input>
            </el-form-item>
            <el-form-item label="上报为完整刀" :label-width="formLabelWidth">
              <el-switch
                v-model="report_record_form.froce_use_full_chance"
              ></el-switch>
            </el-form-item>
            <el-form-item label="代理上报" :label-width="formLabelWidth">
              <el-switch
                v-model="report_record_form.is_proxy_report"
              ></el-switch>
            </el-form-item>
            <el-form-item
              v-if="report_record_form.is_proxy_report && member_list"
              label="代理上报成员"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="report_record_form.proxy_report_member"
                placeholder="请选择代理上报的成员"
                filterable
                clearable
              >
                <el-option
                  v-for="(member, o) in member_list"
                  :key="o"
                  :label="member.uname + '(' + member.uid + ')'"
                  :value="member.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注释" :label-width="formLabelWidth">
              <el-input
                v-model="report_record_form.comment"
                autocomplete="off"
                @keyup.enter="reportRecord"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="report_record_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="reportRecord"
                :disabled="disable_api_call"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
        <!-- 申请出刀选择框 -->
        <el-dialog
          v-model="report_queue_dialog_visible"
          title="申请出刀"
          width="50%"
        >
          <el-form :model="report_queue_form">
            <el-form-item label="Boss" :label-width="formLabelWidth">
              <el-select
                v-model="report_queue_form.target_boss"
                placeholder="请选择申请的Boss"
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注释" :label-width="formLabelWidth">
              <el-input
                v-model="report_queue_form.comment"
                autocomplete="off"
                @keyup.enter="reportQueue"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="report_queue_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="reportQueue"
                :disabled="disable_api_call"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
        <!-- 预约选择框 -->
        <el-dialog
          v-model="report_subscribe_dialog_visible"
          title="预约出刀"
          width="50%"
        >
          <el-form :model="report_subscribe_form">
            <el-form-item label="Boss" :label-width="formLabelWidth">
              <el-select
                v-model="report_subscribe_form.target_boss"
                placeholder="请选择预约的Boss"
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="report_subscribe_form.target_boss"
              label="周目"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="report_subscribe_form.target_cycle"
                placeholder="请选择预约的周目"
              >
                <el-option
                  v-for="(cycle, o) in Array(
                    100 -
                      boss_status[Number(report_subscribe_form.target_boss) - 1]
                        .target_cycle
                  )
                    .fill(
                      boss_status[Number(report_subscribe_form.target_boss) - 1]
                        .target_cycle
                    )
                    .map(
                      (el, i) =>
                        boss_status[
                          Number(report_subscribe_form.target_boss) - 1
                        ].target_cycle + i
                    )"
                  :key="o"
                  :label="cycle + '周目'"
                  :value="cycle+''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注释" :label-width="formLabelWidth">
              <el-input
                v-model="report_subscribe_form.comment"
                autocomplete="off"
                @keyup.enter="reportSubscribe"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="report_subscribe_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="reportSubscribe"
                :disabled="disable_api_call"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
        <!-- SL选择框 -->
        <el-dialog
          v-model="report_sl_dialog_visible"
          title="上报SL"
          width="50%"
        >
          <el-form :model="report_sl_form">
            <el-form-item label="Boss" :label-width="formLabelWidth">
              <el-select
                v-model="report_sl_form.boss"
                placeholder="请选择SL的Boss"
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代理上报" :label-width="formLabelWidth">
              <el-switch v-model="report_sl_form.is_proxy_report"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="report_sl_form.is_proxy_report && member_list"
              label="代理上报成员"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="report_sl_form.proxy_report_uid"
                placeholder="请选择代理上报的成员"
                filterable
                clearable
              >
                <el-option
                  v-for="(member, o) in member_list"
                  :key="o"
                  :label="member.uname + '(' + member.uid + ')'"
                  :value="member.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注释" :label-width="formLabelWidth">
              <el-input
                v-model="report_sl_form.comment"
                autocomplete="off"
                @keyup.enter="reportSL"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="report_sl_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="reportSL"
                :disabled="disable_api_call"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
        <el-menu
          default-active="1"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleMenuSelect"
        >
          <el-menu-item index="1">进度</el-menu-item>
          <el-menu-item index="2">预约表</el-menu-item>
          <el-menu-item index="3">出刀统计</el-menu-item>
          <el-menu-item index="4">出刀记录</el-menu-item>
          <el-menu-item index="5">设置</el-menu-item>
        </el-menu>
        <div class="line"></div>
        <div v-if="active_enum_select == 1">
          <div v-if="boss_status" class="main-content-div">
            <el-row justify="center" :gutter="15">
              <el-col v-for="(boss_item, o) in boss_status" :key="o" :span="4">
                <el-card class="box-card">
                  <p style="margin: 0 0 0 2px">
                    {{ parseInt(boss_item.target_boss) }}王
                  </p>
                  <br />
                  <p style="margin: 0px 0 0 10px">
                    {{ parseInt(boss_item.target_cycle) }}周目
                  </p>
                  <el-progress
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="
                      (boss_item.boss_hp / boss_item.max_boss_hp) * 100
                    "
                    status="exception"
                  >
                    <span style="text-align: center"
                      >{{ parseInt(boss_item.boss_hp) }}/{{
                        parseInt(boss_item.max_boss_hp)
                      }}</span
                    >
                  </el-progress>
                  <div v-if="in_queue_dict" style="margin: 5px 0 0 5px">
                    <div v-if="in_queue_dict[parseInt(o + 1)].length > 0">
                      <p
                        v-for="(queue_item, p) in in_queue_dict[
                          parseInt(o + 1)
                        ]"
                        :key="p"
                      >
                        {{ getMemberUname(queue_item.member_uid) }}正在挑战中
                      </p>
                    </div>
                  </div>
                  <div v-if="on_tree_dict" style="margin: 5px 0 0 5px">
                    <div v-if="on_tree_uname_list[parseInt(o)] != '-None'">
                      <p>
                        {{ on_tree_uname_list[parseInt(o)] }}
                      </p>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 20px">
            <el-row justify="center" :gutter="12">
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="report_record_dialog_visible = true"
                  >报刀</el-button
                >
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="report_queue_dialog_visible = true"
                  >申请出刀</el-button
                >
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="report_subscribe_dialog_visible = true"
                  >预约</el-button
                >
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="report_sl_dialog_visible = true"
                  >上报SL</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="active_enum_select == 2">
          <el-menu
            v-if="subscribe_dict"
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSubMenuSelect"
          >
            <el-menu-item index="1"
              >1王 {{ subscribe_dict["1"].length }}</el-menu-item
            >
            <el-menu-item index="2"
              >2王 {{ subscribe_dict["2"].length }}</el-menu-item
            >
            <el-menu-item index="3"
              >3王 {{ subscribe_dict["3"].length }}</el-menu-item
            >
            <el-menu-item index="4"
              >4王 {{ subscribe_dict["4"].length }}</el-menu-item
            >
            <el-menu-item index="5"
              >5王 {{ subscribe_dict["5"].length }}</el-menu-item
            >
          </el-menu>
          <el-table
            :data="show_subscribe_data"
            :height="subs_table_height"
            border
            class="data-show-form"
            style="width: 100%; background-color: rgba(255, 255, 255, 0.5)"
          >
            <el-table-column prop="member_name" label="成员" />
            <el-table-column prop="target_cycle" label="周目" />
            <el-table-column prop="comment" label="注释" />
          </el-table>
        </div>
        <div v-if="active_enum_select == 3" class="query-record-div">
          <el-table
            :data="battle_status_data"
            :height="status_table_height"
            border
            class="data-show-form"
            style="width: 100%; background-color: rgba(255, 255, 255, 0.5)"
          >
            <el-table-column label="成员">
              <template #default="scope">
                <span>{{
                  getMemberUname(scope.row.uid) + "(" + scope.row.uid + ")"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="today_challenged"
              label="完整刀"
              width="90"
              sortable
            />
            <el-table-column
              prop="addition_challeng"
              label="补偿刀"
              width="90"
              sortable
            />
            <el-table-column
              prop="remain_addition_challeng"
              label="余尾刀"
              width="90"
              sortable
            />
            <el-table-column label="已使用SL" width="85">
              <template #default="scope">
                <el-icon v-if="scope.row.use_sl" style="margin-left: 25px">
                  <check />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="active_enum_select == 4" class="query-record-div">
          <el-form
            :inline="true"
            :model="query_record_form"
            style="margin-top: 10px"
          >
            <el-form-item>
              <el-date-picker
                v-model="query_record_form.date"
                type="date"
                placeholder="选择查询的日期"
                :disabled-date="disabledDate"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="member_list">
              <el-select
                v-model="query_record_form.member"
                placeholder="请选择成员"
                filterable
                clearable
              >
                <el-option
                  v-for="(member, o) in member_list"
                  :key="o"
                  :label="member.uname + '(' + member.uid + ')'"
                  :value="member.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="query_record_form.boss"
                placeholder="请选择Boss"
                clearable
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="query_record_form.cycle"
                placeholder="请选择周目"
                filterable
                clearable
              >
                <el-option
                  v-for="(cycle, o) in max_boss_cycle"
                  :key="o"
                  :label="cycle + '周目'"
                  :value="cycle"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query_record_confirm"
                >确认</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="clear_query_record_form"
                >清空</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="query_record_result_data"
            :height="record_table_height"
            border
            class="data-show-form"
            style="width: 100%; background-color: rgba(255, 255, 255, 0.5)"
          >
            <el-table-column label="日期" width="220">
              <template #default="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  getCnTime(scope.row.record_time)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="成员">
              <template #default="scope">
                <span>{{
                  getMemberUname(scope.row.member_uid) +
                  "(" +
                  scope.row.member_uid +
                  ")"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="target_boss" label="Boss" width="60" />
            <el-table-column
              prop="target_cycle"
              label="周目"
              width="75"
              sortable
            />
            <el-table-column prop="damage" label="伤害" width="140" sortable />
            <el-table-column prop="comment" label="注释" />
            <el-table-column label="补偿刀" width="65">
              <template #default="scope">
                <el-icon
                  v-if="scope.row.is_extra_time"
                  style="margin-left: 17px"
                >
                  <check />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="active_enum_select == 5">
          <div
            style="
              background-color: rgba(255, 255, 255, 0.7) !important;
              margin-top: 10px;
            "
          >
            <el-row>
              <el-col :span="4" style="text-align: center; margin-top: 10px">
                <span style="line-height: 42px">当前会战档案：</span>
              </el-col>
              <el-col :span="20" style="margin-top: 10px">
                <el-select
                  v-model="current_clanbattle_data"
                  placeholder="选择当前的会战档案"
                >
                  <el-option
                    v-for="item in 10"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row style="margin-top: 40px">
              <el-col :span="19"></el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  @click="logout"
                  style="margin-bottom: 10px"
                  >退出登录</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
// @ is an alias to /src
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";

export default {
  name: 'Clan',
  data() {
    return {
      refresh_timer_id: null,
      joined_clan: null,
      member_list: null,
      in_queue_dict: null,
      subscribe_dict: null,
      show_subscribe_data: [],
      query_record_result_data: [],
      battle_status_data: [],
      on_tree_dict: null,
      //on_tree_uname_list: [],
      selscted_clan: "",
      current_clanbattle_data: null,
      disable_api_call: false,
      chose_clan_dialog_visible: false,
      report_record_dialog_visible: false,
      report_queue_dialog_visible: false,
      report_subscribe_dialog_visible: false,
      report_sl_dialog_visible: false,
      active_sub_enum_select: 1,
      active_enum_select: 1,
      boss_status: null,
      max_boss_cycle: 1,
      formLabelWidth: '120px',
      subs_table_height: "800px",
      status_table_height: "800px",
      record_table_height: "800px",
      report_record_form: {
        clan_gid: null,
        target_boss: null,
        damage: null,
        is_kill_boss: false,
        froce_use_full_chance: false,
        is_proxy_report: false,
        proxy_report_member: null,
        comment: null
      },
      report_queue_form: {
        clan_gid: null,
        target_boss: null,
        comment: null
      },
      report_subscribe_form: {
        clan_gid: null,
        target_boss: null,
        target_cycle: null,
        comment: null
      },
      report_sl_form: {
        clan_gid: null,
        boss: null,
        comment: null,
        is_proxy_report: false,
        proxy_report_uid: null,
      },
      query_record_form: {
        clan_gid: '',
        date: '',
        member: '',
        boss: '',
        cycle: '',
      }
    }
  },
  computed: {
    on_tree_uname_list() {
      let list = []
      if (this.on_tree_dict != null) {
        for (let i = 1; i < 6; i++) {
          let name_str = "-None"
          for (let obj of this.on_tree_dict[i.toString()]) {
            name_str += "、" + this.getMemberUname(obj.member_uid)
          }
          if (name_str != "-None") {
            name_str = name_str.substr(6)
            name_str += "还在树上"
          }
          list.push(name_str)
        }
      }
      return list
    }
  },
  watch: {
    selscted_clan(newValue) {
      this.report_record_form.clan_gid = newValue
      this.report_queue_form.clan_gid = newValue
      this.report_subscribe_form.clan_gid = newValue
      this.query_record_form.clan_gid = newValue
      this.report_sl_form.clan_gid = newValue
      this.refreshStatus()
    },
    current_clanbattle_data(newValue, oldValue) {
      if (oldValue != null && newValue != oldValue) {
        this.setClanbattleDataNumber()
      }
    },
    active_sub_enum_select(newValue) {
      let subscribe_data = []
      if (this.subscribe_dict) {
        for (let sub of this.subscribe_dict[newValue]) {
          subscribe_data.push({ member_name: this.getMemberUname(sub.member_uid) + '(' + sub.member_uid + ')', target_cycle: sub.target_cycle, comment: sub.comment })
        }
        this.show_subscribe_data = subscribe_data
      }
    }
  },
  setup() {
  },
  created() {
    if (!localStorage.getItem("selscted_clan")) {
      this.getClanInfo()
    }
    else {
      this.selscted_clan = localStorage.getItem("selscted_clan")
    }
    //this.handleSubMenuSelect('1')
    this.getFormHeight()
    window.addEventListener('resize', this.getFormHeight);
  },
  components: {
  },
  methods: {
    handleChoseClanClose(done) {
      ElMessageBox.confirm('你确定要退出公会选择吗？')
        .then(() => {
          done()
        })
        .catch(() => {
          // catch error
        })
    },
    refreshStatus() {
      this.getClanMember()//其他都要在获取公会成员之后，要不然有可能用户名有问题
    },
    getOnTree() {
      axios.get("api/clanbattle/on_tree_list", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) this.on_tree_dict = resp.data.on_tree
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        })
    },
    getSubscribes() {
      axios.get("api/clanbattle/subscribe_list", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.active_sub_enum_select = "1"
            this.subscribe_dict = resp.data.subscribe
          }
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        })
    },
    getMemberUname(uid) {
      if (!this.member_list) return null
      for (let member of this.member_list) {
        if (member.uid == uid) return member.uname
      }
      return null
    },
    getInQueue() {
      axios.get("api/clanbattle/get_in_queue", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) this.in_queue_dict = resp.data.queue
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        })
    },
    reportQueue() {
      this.disable_api_call = true
      if (!this.report_queue_form.target_boss) {
        ElMessage.error("请选择挑战的Boss");
        this.disable_api_call = false
        return
      }
      axios.post("api/clanbattle/report_queue", this.report_queue_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("申请出刀成功");
            this.refreshStatus();
            this.report_queue_dialog_visible = false
            this.report_queue_form.target_boss = null
            this.report_queue_form.comment = null
          }
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false
        });
    },
    reportRecord() {
      this.disable_api_call = true
      if (!this.report_record_form.target_boss) {
        ElMessage.error("请选择挑战的Boss");
        this.disable_api_call = false
        return
      }
      if (!this.report_record_form.is_kill_boss && !this.report_record_form.damage) {
        ElMessage.error("请输入造成的伤害");
        this.disable_api_call = false
        return
      }
      if (this.report_record_form.is_proxy_report && !this.report_record_form.proxy_report_member) {
        ElMessage.error("请选择代理上报的对象");
        this.disable_api_call = false
        return
      }
      axios.post("api/clanbattle/report_record", this.report_record_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("上报成功");
            this.refreshStatus();
            this.report_record_dialog_visible = false
            this.report_record_form.target_boss = null
            this.report_record_form.damage = null
            this.report_record_form.is_kill_boss = false
            this.report_record_form.froce_use_full_chance = false
            this.report_record_form.is_proxy_report = false
            this.report_record_form.proxy_report_member = null
            this.report_record_form.comment = null
          }
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false
        });
    },
    reportUnqueue() {
      this.disable_api_call = true
      axios.get("api/clanbattle/report_unqueue", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) ElMessage.success("取消申请出刀成功");
          else ElMessage.error(resp.data.msg);
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
          this.disable_api_call = false
        })
    },
    reportSubscribe() {
      this.disable_api_call = true
      if (!this.report_subscribe_form.target_boss) {
        ElMessage.error("请选择预约的Boss");
        this.disable_api_call = false
        return
      }
      if (!this.report_subscribe_form.target_cycle) {
        ElMessage.error("请选择预约的周目");
        this.disable_api_call = false
        return
      }
      axios.post("api/clanbattle/report_subscribe", this.report_subscribe_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("预约成功");
            this.refreshStatus();
            this.report_subscribe_dialog_visible = false
            this.report_subscribe_form.target_boss = null
            this.report_subscribe_form.target_cycle = null
            this.report_subscribe_form.comment = null
          }
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false
        });
    },
    reportSL() {
      this.disable_api_call = true
      if (!this.report_sl_form.boss) {
        ElMessage.error("请选择SL的Boss");
        this.disable_api_call = false
        return
      }
      if (this.report_sl_form.is_proxy_report && !this.report_sl_form.proxy_report_uid) {
        ElMessage.error("请选择代理上报的对象");
        this.disable_api_call = false
        return
      }
      axios.post("api/clanbattle/report_sl", this.report_sl_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("上报SL成功");
            this.refreshStatus();
            this.report_sl_dialog_visible = false
            this.report_sl_form.boss = null
            this.report_sl_form.is_proxy_report = false
            this.report_sl_form.proxy_report_uid = null
            this.report_sl_form.comment = null
          }
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false
        });
    },
    setClanbattleDataNumber() {
      this.disable_api_call = true
      axios.post("api/clanbattle/change_current_clanbattle_data_num", { clan_gid: this.selscted_clan, data_num: this.current_clanbattle_data })
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
            this.refreshStatus();
          } else {
            ElMessage.success("修改当前公会战档案成功");
            this.refreshStatus();
          }
          this.disable_api_call = false
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false
        });
    },
    getClanMember() {
      //ElNotification.info("正在获取公会成员信息")
      axios.get("api/clanbattle/member_list", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.member_list = resp.data.member_list
            if (this.refresh_timer_id == null) {
              this.refresh_timer_id = setInterval(() => {
                console.log("refresh data");
                this.refreshStatus();
              }, 15000);
            }
            this.getBossStatus()
            this.getInQueue()
            this.getSubscribes()
            this.getOnTree()
            this.getBattleStatus()
            this.getClanBattleDataNum()
          }
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        })
    },
    getBossStatus() {
      //ElNotification.info("正在获取Boss信息")
      axios.get("api/clanbattle/boss_status", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.boss_status = resp.data.boss_status
            let max_cycle = 1
            for (let status of resp.data.boss_status) {
              if (status.target_cycle > max_cycle) max_cycle = status.target_cycle
            }
            this.max_boss_cycle = max_cycle
          }
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        })
    },
    getClanInfo() {
      ElNotification.info("正在获取公会信息")
      axios.get("api/clanbattle/get_joined_clan")
        .then((resp) => {
          console.log(resp.data)
          if (resp.data.err_code != 0) this.$router.push("/login")
          this.joined_clan = resp.data.clan_list
          if (resp.data.clan_list.length == 0) {
            ElMessage.error("您还没有加入任何公会");
          }
          else if (resp.data.clan_list.length == 1) {
            this.selscted_clan = resp.data.clan_list[0]
            localStorage.setItem("selscted_clan", this.selscted_clan)
          }
          else {
            this.chose_clan_dialog_visible = true
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        })
    },
    getBattleStatus() {
      axios.get("api/clanbattle/battle_status", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) this.battle_status_data = resp.data.status
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        })
    },
    getClanBattleDataNum() {
      axios.get("api/clanbattle/current_clanbattle_data_num", { params: { clan_gid: this.selscted_clan } })
        .then((resp) => {
          if (resp.data.err_code == 0) this.current_clanbattle_data = resp.data.data_num
          else this.$router.push("/login")
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        })
    },
    getFormHeight() {
      this.record_table_height = window.innerHeight - 285.5 + 'px';
      this.status_table_height = window.innerHeight - 213 + 'px';
      this.subs_table_height = window.innerHeight - 274 + 'px';
    },
    getCnTime(utcTime) {
      let date = new Date(utcTime)
      date.setHours(date.getHours() + 8)
      return date.toLocaleString()
    },
    query_record_confirm() {
      axios.post("api/clanbattle/query_record", this.query_record_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            this.query_record_result_data = resp_data.record
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
        });
    },
    clear_query_record_form() {
      this.query_record_form.date = ''
      this.query_record_form.member = ''
      this.query_record_form.boss = ''
      this.query_record_form.cycle = ''
    },
    handleMenuSelect(key) {
      this.active_enum_select = key
    },
    handleSubMenuSelect(key) {
      this.active_sub_enum_select = key
    },
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    logout() {
      document.cookie = "session=0;expires=-1";
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
.main-content-div {
  margin-top: 20px;
  text-align: center;
  word-wrap: break-word;
  word-break: normal;
}
</style>

<style lang="scss">
.data-show-form tr {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
.query-record-div tr {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
</style>