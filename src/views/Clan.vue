<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <!-- 多公会选择框 -->
        <el-dialog
          v-model="chose_clan_dialog_visible"
          title="选择公会"
          width="30%"
          :before-close="handleChoseClanClose"
        >
          <el-select
            v-model="selscted_clan"
            placeholder="请选择当前公会"
            filterable
          >
            <el-option
              v-for="(clan, o) in joined_clan"
              :key="o"
              :label="clan"
              :value="clan"
            ></el-option>
          </el-select>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                type="primary"
                @click="chose_clan_dialog_visible = false"
                >确认</el-button
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
            <el-form-item v-if="clan_area != 'cn'" label="Boss" :label-width="formLabelWidth">
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
            <el-form-item v-if="clan_area != 'cn'" label="Boss" :label-width="formLabelWidth">
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
                  :value="cycle + ''"
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
            <el-form-item v-if="clan_area != 'cn'" label="Boss" :label-width="formLabelWidth">
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
        <!-- 移除成员选择框 -->
        <el-dialog
          v-model="remove_member_dialog_visible"
          title="移除成员"
          width="50%"
        >
          <el-form :model="remove_member_form">
            <el-form-item label="移除成员" :label-width="formLabelWidth">
              <el-select
                v-model="remove_member_form.remove_member"
                placeholder="请选择要移除的成员"
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
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="remove_member_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="reportRemoveMember"
                :disabled="disable_api_call"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
        <!-- 调整进度选择框 -->
        <el-dialog
          v-model="change_boss_status_dialog_visible"
          title="调整进度"
          width="50%"
        >
          <el-form :model="report_subscribe_form">
            <el-form-item label="Boss" :label-width="formLabelWidth">
              <el-select
                v-model="change_boss_status_form.boss"
                placeholder="请选择要调整的Boss"
              >
                <el-option label="1王" value="1"></el-option>
                <el-option label="2王" value="2"></el-option>
                <el-option label="3王" value="3"></el-option>
                <el-option label="4王" value="4"></el-option>
                <el-option label="5王" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="change_boss_status_form.boss"
              label="周目"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="change_boss_status_form.cycle"
                placeholder="请选择要调整到的周目"
              >
                <el-option
                  v-for="(cycle, o) in Array(100)
                    .fill(0)
                    .map((el, i) => 1 + i)"
                  :key="o"
                  :label="cycle + '周目'"
                  :value="cycle + ''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="change_boss_status_form.cycle"
              label="剩余血量"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="change_boss_status_form.remain_hp"
                placeholder="请输入要调整到的剩余血量（错误的血量可能导致严重问题，请务必检查）"
                autocomplete="off"
                @keyup.enter="repostChangeBossStatus"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="change_boss_status_dialog_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="repostChangeBossStatus"
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
          <el-menu-item index="5">会战统计</el-menu-item>
          <el-menu-item index="6">设置</el-menu-item>
        </el-menu>
        <div class="line"></div>
        <div v-if="active_enum_select == 1">
          <div v-if="boss_status" class="main-content-div">
            <div v-if="clan_area != 'cn'">
              <el-row justify="center" :gutter="15">
                <el-col
                  v-for="(boss_item, o) in boss_status"
                  :key="o"
                  :span="4"
                >
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
                          <span
                            v-if="
                              !(
                                queue_item.comment == null ||
                                queue_item.comment == ''
                              )
                            "
                          >
                            ：备注{{ queue_item.comment }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div v-if="on_tree_dict" style="margin: 5px 0 0 5px">
                      <div v-if="on_tree_dict[parseInt(o + 1)].length > 0">
                        <p
                          v-for="(on_tree_item, p) in on_tree_dict[
                            parseInt(o + 1)
                          ]"
                          :key="p"
                        >
                          {{
                            getMemberUname(on_tree_item.member_uid)
                          }}还挂在树上
                          <span
                            v-if="
                              !(
                                on_tree_item.comment == null ||
                                on_tree_item.comment == ''
                              )
                            "
                          >
                            ：备注{{ on_tree_item.comment }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <!--<div v-if="on_tree_dict" style="margin: 5px 0 0 5px">
                        <div v-if="on_tree_uname_list[parseInt(o)] != '-None'">
                          <p>
                            {{ on_tree_uname_list[parseInt(o)] }}
                          </p>
                        </div>
                      </div>-->
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <div v-if="clan_area == 'cn'">
              <el-row justify="center" :gutter="15">
                <el-col :span="14">
                  <el-card class="box-card">
                    <p style="margin: 0 0 0 2px">
                      {{ parseInt(boss_status.target_boss) }}王
                    </p>
                    <br />
                    <p style="margin: 0px 0 0 10px">
                      {{ parseInt(boss_status.target_cycle) }}周目
                    </p>
                    <el-progress
                      :text-inside="true"
                      :stroke-width="20"
                      :percentage="
                        (boss_status.boss_hp / boss_status.max_boss_hp) * 100
                      "
                      status="exception"
                    >
                      <span style="text-align: center"
                        >{{ parseInt(boss_status.boss_hp) }}/{{
                          parseInt(boss_status.max_boss_hp)
                        }}</span
                      >
                    </el-progress>
                    <div v-if="in_queue_dict" style="margin: 5px 0 0 5px">
                      <div
                        v-if="
                          in_queue_dict[boss_status.target_boss].length > 0
                        "
                      >
                        <p
                          v-for="(queue_item, p) in in_queue_dict[
                            boss_status.target_boss
                          ]"
                          :key="p"
                        >
                          {{ getMemberUname(queue_item.member_uid) }}正在挑战中
                          <span
                            v-if="
                              !(
                                queue_item.comment == null ||
                                queue_item.comment == ''
                              )
                            "
                          >
                            ：备注{{ queue_item.comment }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div v-if="on_tree_dict" style="margin: 5px 0 0 5px">
                      <div
                        v-if="
                          on_tree_dict[boss_status.target_boss].length > 0
                        "
                      >
                        <p
                          v-for="(on_tree_item, p) in on_tree_dict[
                            boss_status.target_boss
                          ]"
                          :key="p"
                        >
                          {{
                            getMemberUname(on_tree_item.member_uid)
                          }}还挂在树上
                          <span
                            v-if="
                              !(
                                on_tree_item.comment == null ||
                                on_tree_item.comment == ''
                              )
                            "
                          >
                            ：备注{{ on_tree_item.comment }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <!--<div v-if="on_tree_dict" style="margin: 5px 0 0 5px">
                    <div v-if="on_tree_uname_list[parseInt(o)] != '-None'">
                      <p>
                        {{ on_tree_uname_list[parseInt(o)] }}
                      </p>
                    </div>
                  </div>-->
                  </el-card>
                </el-col>
              </el-row>
            </div>
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
            <el-row justify="center" style="margin-top: 20px" :gutter="12">
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="change_boss_status_dialog_visible = true"
                  >修改Boss状态</el-button
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
          <el-form
            :inline="true"
            :model="query_challenge_status_form"
            style="margin-top: 10px"
          >
            <el-form-item>
              <el-switch
                v-model="active_challenge_status_mode"
                active-text="三刀视图"
                inactive-text="简易"
              />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="query_challenge_status_form.date"
                type="date"
                placeholder="选择查询的日期"
                :disabled-date="disabledDate"
                @change="handleQueryChallengeDataChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="selectAllNoticeMember"
                >选择全部可提醒成员</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="clearSelectAllNoticeMember"
                >清空已选择提醒成员</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="reportNoticeMember"
                :disabled="disable_api_call"
                >提醒已选择成员</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            :data="battle_status_data"
            :height="status_table_height"
            border
            v-if="active_challenge_status_mode == false"
            class="data-show-form"
            style="width: 100%; background-color: rgba(255, 255, 255, 0.5)"
          >
            <el-table-column :label="`成员 （${member_list.length} / 30）`">
              <template #default="scope">
                <span>{{
                  getMemberUname(scope.row.uid) + "(" + scope.row.uid + ")"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="today_challenged"
              :label="'完整刀（' + total_used_full_chance + ' / 90）'"
              width="170"
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
              :label="'余尾刀 ' + total_unused_addition_chance"
              width="110"
              sortable
            />
            <el-table-column label="已使用SL" width="85">
              <template #default="scope">
                <el-icon v-if="scope.row.use_sl" style="margin-left: 25px">
                  <check />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column label="提醒出刀" width="85">
              <template #default="scope">
                <el-checkbox
                  style="margin-left: 25px"
                  v-model="notice_challenge_form.notice_member[scope.row.uid]"
                  :disabled="
                    query_challenge_status_form.date != null ||
                    scope.row.today_challenged >= 3
                  "
                ></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="today_all_records"
            :height="status_table_height"
            border
            v-if="active_challenge_status_mode == true"
            class="data-show-form"
            style="width: 100%; background-color: rgba(255, 255, 255, 0.5)"
          >
            <el-table-column
              :label="`成员 （${member_list.length} / 30）`"
              width="260"
            >
              <template #default="scope">
                <span>{{
                  getMemberUname(scope.row.uid) + "(" + scope.row.uid + ")"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="第一刀" align="center">
              <el-table-column label="完整刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_1 != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_1.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_1.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_1.damage
                    }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="补偿刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_1_r != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_1_r.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_1_r.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_1_r.damage
                    }}</span>
                  </span>
                  <span
                    v-if="
                      scope.row.challenge_1_r == null &&
                      scope.row.challenge_1 != null &&
                      scope.row.challenge_1.remain_next_chance
                    "
                    style="color: rgba(255, 20, 147, 0.9)"
                  >
                    待出刀
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="第二刀" align="center">
              <el-table-column label="完整刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_2 != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_2.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_2.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_2.damage
                    }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="补偿刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_2_r != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_2_r.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_2_r.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_2_r.damage
                    }}</span>
                  </span>
                  <span
                    v-if="
                      scope.row.challenge_2_r == null &&
                      scope.row.challenge_2 != null &&
                      scope.row.challenge_2.remain_next_chance
                    "
                    style="color: rgba(255, 20, 147, 0.9)"
                  >
                    待出刀
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="第三刀" align="center">
              <el-table-column label="完整刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_3 != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_3.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_3.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_3.damage
                    }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="补偿刀" align="center">
                <template #default="scope">
                  <span v-if="scope.row.challenge_3_r != null">
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_3_r.target_cycle
                    }}</span>
                    <span>周目</span>
                    <span style="color: rgba(255, 51, 51, 0.9)">{{
                      scope.row.challenge_3_r.target_boss
                    }}</span>
                    <span>王</span>
                    <br />
                    <span>伤害：</span>
                    <span style="color: rgba(51, 204, 255, 1)">{{
                      scope.row.challenge_3_r.damage
                    }}</span>
                  </span>
                  <span
                    v-if="
                      scope.row.challenge_3_r == null &&
                      scope.row.challenge_3 != null &&
                      scope.row.challenge_3.remain_next_chance
                    "
                    style="color: rgba(255, 20, 147, 0.9)"
                  >
                    待出刀
                  </span>
                </template>
              </el-table-column>
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
        <div v-if="active_enum_select == 5" class="analyze-data-div">
          <el-menu
            v-if="boss_status"
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleAlyzeMenuSelect"
          >
            <el-menu-item index="1">公会总表</el-menu-item>
            <el-menu-item index="2">个人数据统计</el-menu-item>
          </el-menu>
          <div v-if="active_analyze_enum_select == 1">
            <el-table
              :data="full_clanbattle_analyze_clan_data_build"
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
                prop="total_damage"
                label="总伤害"
                width="170"
                sortable
              />
              <el-table-column
                prop="full_challenge"
                label="总刀数"
                width="90"
                sortable
              />
              <el-table-column
                prop="remain_challenge"
                label="补偿刀"
                width="90"
                sortable
              />
            </el-table>
          </div>
          <div v-if="active_analyze_enum_select == 2">
            <div
              style="height: 440px; background-color: rgba(255, 255, 255, 0.75)"
            >
              <el-row>
                <el-col :span="12">
                  <div
                    style="height: 40px; text-align: center; margin-top: 15px"
                  >
                    各Boss伤害占比
                  </div>
                </el-col>
                <el-col :span="12">
                  <div
                    style="height: 40px; text-align: center; margin-top: 15px"
                  >
                    个人伤害占比
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div
                    id="personal_boss_damage_status_chart"
                    style="height: 400px"
                  ></div>
                </el-col>
                <el-col :span="12"
                  ><div
                    id="personal_boss_damage_in_clan_chart"
                    style="height: 400px"
                  ></div
                ></el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div v-if="active_enum_select == 6">
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
              <el-col :span="11"></el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  @click="remove_member_dialog_visible = true"
                  >移除公会成员</el-button
                >
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="chose_clan_dialog_visible = true"
                  style="margin-bottom: 10px"
                  >重新选择公会</el-button
                >
              </el-col>
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

import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts';
// 引入饼图
import { BarChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default {
  name: "Clan",
  data() {
    return {
      self_uid: null,
      refresh_timer_id: null,
      joined_clan: null,
      member_list: null,
      in_queue_dict: null,
      subscribe_dict: null,
      clan_area: null,
      show_subscribe_data: [],
      query_record_result_data: [],
      battle_status_data: [],
      full_clanbattle_analyze_data: [],
      full_clanbattle_analyze_clan_data_build: [],
      full_clanbattle_analyze_fullclan_data_build: [],
      full_clanbattle_analyze_person_data_build: [],
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
      remove_member_dialog_visible: false,
      change_boss_status_dialog_visible: false,
      active_sub_enum_select: 1,
      active_enum_select: 1,
      active_analyze_enum_select: 1,
      active_challenge_status_mode: false,
      boss_status: null,
      max_boss_cycle: 1,
      formLabelWidth: "120px",
      subs_table_height: "800px",
      status_table_height: "800px",
      record_table_height: "800px",
      active_echarts: null,
      today_all_records: null,
      query_challenge_status_form: {
        clan_gid: null,
        date: null,
      },
      notice_challenge_form: {
        clan_gid: null,
        notice_member: {},
      },
      report_record_form: {
        clan_gid: null,
        target_boss: null,
        damage: null,
        is_kill_boss: false,
        froce_use_full_chance: false,
        is_proxy_report: false,
        proxy_report_member: null,
        comment: null,
      },
      report_queue_form: {
        clan_gid: null,
        target_boss: null,
        comment: null,
      },
      report_subscribe_form: {
        clan_gid: null,
        target_boss: null,
        target_cycle: null,
        comment: null,
      },
      report_sl_form: {
        clan_gid: null,
        boss: null,
        comment: null,
        is_proxy_report: false,
        proxy_report_uid: null,
      },
      change_boss_status_form: {
        clan_gid: null,
        boss: null,
        cycle: null,
        remain_hp: null,
      },
      query_record_form: {
        clan_gid: "",
        date: "",
        member: "",
        boss: "",
        cycle: "",
      },
      remove_member_form: {
        clan_gid: null,
        remove_member: "",
      },
    };
  },
  computed: {
    on_tree_uname_list() {
      let list = [];
      if (this.on_tree_dict != null) {
        for (let i = 1; i < 6; i++) {
          let name_str = "-None";
          for (let obj of this.on_tree_dict[i.toString()]) {
            name_str += "、" + this.getMemberUname(obj.member_uid);
          }
          if (name_str != "-None") {
            name_str = name_str.substr(6);
            name_str += "还在树上";
          }
          list.push(name_str);
        }
      }
      return list;
    },
    total_used_full_chance() {
      let chance = 0;
      if (!this.battle_status_data) return null;
      for (let status_obj of this.battle_status_data) {
        chance += status_obj.today_challenged;
      }
      return chance;
    },
    total_unused_addition_chance() {
      let chance = 0;
      if (!this.battle_status_data) return null;
      for (let status_obj of this.battle_status_data) {
        chance += status_obj.remain_addition_challeng;
      }
      return chance;
    },
  },
  watch: {
    selscted_clan(newValue) {
      this.report_record_form.clan_gid = newValue;
      this.report_queue_form.clan_gid = newValue;
      this.report_subscribe_form.clan_gid = newValue;
      this.query_record_form.clan_gid = newValue;
      this.report_sl_form.clan_gid = newValue;
      this.query_challenge_status_form.clan_gid = newValue;
      this.notice_challenge_form.clan_gid = newValue;
      this.remove_member_form.clan_gid = newValue;
      this.change_boss_status_form.clan_gid = newValue;
      this.getClanArea();
      this.refreshStatus();
      localStorage.setItem("selscted_clan", this.selscted_clan);
    },
    current_clanbattle_data(newValue, oldValue) {
      if (oldValue != null && newValue != oldValue) {
        this.setClanbattleDataNumber();
      }
    },
    active_sub_enum_select(newValue) {
      let subscribe_data = [];
      if (this.subscribe_dict) {
        for (let sub of this.subscribe_dict[newValue]) {
          subscribe_data.push({
            member_name:
              this.getMemberUname(sub.member_uid) + "(" + sub.member_uid + ")",
            target_cycle: sub.target_cycle,
            comment: sub.comment,
          });
        }
        this.show_subscribe_data = subscribe_data;
      }
    },
    member_list(newValue) {
      let notice_challenge_member_dict = {};
      for (let item of newValue) {
        notice_challenge_member_dict[item.uid] = false;
      }
      this.notice_challenge_form.notice_member = notice_challenge_member_dict;
    },
    active_enum_select(newValue) {
      if (newValue == 5) {
        this.$data.active_analyze_enum_select = 1;
      } else {
        this.destoryAnalyzeEcharts();
      }
      if (newValue == 2) {
        this.active_sub_enum_select = 1;
      }
    },
    active_analyze_enum_select(newValue) {
      if (this.active_enum_select == 5) {
        if (newValue == 2) {
          this.$nextTick(() => this.initAnalyzeEcharts());
        }
      }
    },
  },
  setup() { },
  created() {
    if (!localStorage.getItem("selscted_clan")) {
      this.getClanInfo();
    } else {
      this.selscted_clan = localStorage.getItem("selscted_clan");
      this.clan_area = localStorage.getItem("clan_area");
      this.getClanArea();
      this.getClanInfo();
    }
    this.self_uid = localStorage.getItem("uid");
    //this.handleSubMenuSelect('1')
    this.getFormHeight();
    window.addEventListener("resize", this.getFormHeight);
  },
  components: {},
  methods: {
    handleChoseClanClose(done) {
      ElMessageBox.confirm("你确定要退出公会选择吗？")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    },
    refreshStatus() {
      this.getClanMember(); //其他都要在获取公会成员之后，要不然有可能用户名有问题
    },
    getOnTree() {
      axios
        .get("api/clanbattle/on_tree_list", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) this.on_tree_dict = resp.data.on_tree;
          else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    getTodayRecords() {
      let current_date = this.query_challenge_status_form.date == null ? new Date(new Date().setHours(0, 0, 0, 0)) : this.query_challenge_status_form.date;
      let query_form = {
        clan_gid: this.selscted_clan,
        date: current_date,
        member: "",
        boss: "",
        cycle: "",
      }
      axios
        .post("api/clanbattle/query_record", query_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            let today_all_records = resp_data.record.reverse();
            //console.log(today_all_records)
            let build_list = []
            //sort to dict
            //create dict It's shit but it work fine, so just ok :)
            for (let member of this.member_list) {
              let challenge_1 = null;
              let challenge_1_r = null;
              let challenge_2 = null;
              let challenge_2_r = null;
              let challenge_3 = null;
              let challenge_3_r = null;
              for (let challenge of today_all_records) {
                if (challenge.member_uid == member.uid) {
                  if (!challenge.is_extra_time) {
                    if (challenge_1 == null) {
                      challenge_1 = challenge;
                      continue;
                    }
                    else if (challenge_2 == null) {
                      challenge_2 = challenge;
                      continue;
                    }
                    else if (challenge_3 == null) {
                      challenge_3 = challenge;
                      continue;
                    }
                  }
                  else {
                    if (challenge_1_r == null && challenge_1 != null && challenge_1.remain_next_chance == true) {
                      challenge_1_r = challenge;
                      continue;
                    }
                    else if (challenge_2_r == null && challenge_2 != null && challenge_2.remain_next_chance == true) {
                      challenge_2_r = challenge;
                      continue;
                    }
                    else if (challenge_3_r == null && challenge_3 != null && challenge_3.remain_next_chance == true) {
                      challenge_3_r = challenge;
                      continue;
                    }
                  }

                }
              }
              build_list.push({
                uid: member.uid,
                challenge_1: challenge_1,
                challenge_1_r: challenge_1_r,
                challenge_2: challenge_2,
                challenge_2_r: challenge_2_r,
                challenge_3: challenge_3,
                challenge_3_r: challenge_3_r,
              })
            }
            this.today_all_records = build_list
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
        });
    },
    getSubscribes() {
      axios
        .get("api/clanbattle/subscribe_list", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.active_sub_enum_select = "1";
            this.subscribe_dict = resp.data.subscribe;
          } else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    getClanArea() {
      axios
        .get("api/clanbattle/clan_area", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.clan_area = resp.data.area;
            localStorage.setItem("clan_area",resp.data.area)
          } else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    getMemberUname(uid) {
      if (!this.member_list) return null;
      for (let member of this.member_list) {
        if (member.uid == uid) return member.uname;
      }
      return null;
    },
    getInQueue() {
      axios
        .get("api/clanbattle/get_in_queue", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) this.in_queue_dict = resp.data.queue;
          else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    reportQueue() {
      this.disable_api_call = true;
      if (this.clan_area == "cn") {
        this.report_queue_form.target_boss = this.boss_status.target_boss.toString()
      }
      if (!this.report_queue_form.target_boss) {
        ElMessage.error("请选择挑战的Boss");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/report_queue", this.report_queue_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("申请出刀成功");
            this.refreshStatus();
            this.report_queue_dialog_visible = false;
            this.report_queue_form.target_boss = null;
            this.report_queue_form.comment = null;
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    reportRecord() {
      this.disable_api_call = true;
      if (this.clan_area == "cn") {
        this.report_record_form.target_boss = this.boss_status.target_boss.toString()
      }
      if (!this.report_record_form.target_boss) {
        ElMessage.error("请选择挑战的Boss");
        this.disable_api_call = false;
        return;
      }
      if (
        !this.report_record_form.is_kill_boss &&
        !this.report_record_form.damage
      ) {
        ElMessage.error("请输入造成的伤害");
        this.disable_api_call = false;
        return;
      }
      if (
        this.report_record_form.is_proxy_report &&
        !this.report_record_form.proxy_report_member
      ) {
        ElMessage.error("请选择代理上报的对象");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/report_record", this.report_record_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("上报成功");
            this.refreshStatus();
            this.report_record_dialog_visible = false;
            this.report_record_form.target_boss = null;
            this.report_record_form.damage = null;
            this.report_record_form.is_kill_boss = false;
            this.report_record_form.froce_use_full_chance = false;
            this.report_record_form.is_proxy_report = false;
            this.report_record_form.proxy_report_member = null;
            this.report_record_form.comment = null;
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    reportUnqueue() {
      this.disable_api_call = true;
      axios
        .get("api/clanbattle/report_unqueue", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) ElMessage.success("取消申请出刀成功");
          else ElMessage.error(resp.data.msg);
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
          this.disable_api_call = false;
        });
    },
    reportSubscribe() {
      this.disable_api_call = true;
      if (!this.report_subscribe_form.target_boss) {
        ElMessage.error("请选择预约的Boss");
        this.disable_api_call = false;
        return;
      }
      if (!this.report_subscribe_form.target_cycle) {
        ElMessage.error("请选择预约的周目");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/report_subscribe", this.report_subscribe_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("预约成功");
            this.refreshStatus();
            this.report_subscribe_dialog_visible = false;
            this.report_subscribe_form.target_boss = null;
            this.report_subscribe_form.target_cycle = null;
            this.report_subscribe_form.comment = null;
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    reportSL() {
      this.disable_api_call = true;
      if (this.clan_area == "cn") {
        this.report_sl_form.boss = this.boss_status.target_boss.toString()
      }
      if (!this.report_sl_form.boss) {
        ElMessage.error("请选择SL的Boss");
        this.disable_api_call = false;
        return;
      }
      if (
        this.report_sl_form.is_proxy_report &&
        !this.report_sl_form.proxy_report_uid
      ) {
        ElMessage.error("请选择代理上报的对象");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/report_sl", this.report_sl_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("上报SL成功");
            this.refreshStatus();
            this.report_sl_dialog_visible = false;
            this.report_sl_form.boss = null;
            this.report_sl_form.is_proxy_report = false;
            this.report_sl_form.proxy_report_uid = null;
            this.report_sl_form.comment = null;
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    repostChangeBossStatus() {
      this.disable_api_call = true;
      if (!this.change_boss_status_form.boss) {
        ElMessage.error("请选择要修改进度的Boss");
        this.disable_api_call = false;
        return;
      }
      if (!this.change_boss_status_form.cycle) {
        ElMessage.error("请选择要修改的周目");
        this.disable_api_call = false;
        return;
      }
      if (!this.change_boss_status_form.remain_hp) {
        ElMessage.error("请输入Boss的剩余血量");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/change_boss_status", this.change_boss_status_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("修改进度成功");
            this.refreshStatus();
            this.change_boss_status_dialog_visible = false;
            this.change_boss_status_form.boss = null;
            this.change_boss_status_form.cycle = null;
            this.change_boss_status_form.remain_hp = null;
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    setClanbattleDataNumber() {
      this.disable_api_call = true;
      axios
        .post("api/clanbattle/change_current_clanbattle_data_num", {
          clan_gid: this.selscted_clan,
          data_num: this.current_clanbattle_data,
        })
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
            this.refreshStatus();
          } else {
            ElMessage.success("修改当前公会战档案成功");
            this.refreshStatus();
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    getClanMember() {
      //ElNotification.info("正在获取公会成员信息")
      axios
        .get("api/clanbattle/member_list", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            if (this.member_list != null) {
              let is_list_same = true;
              if (this.member_list.length == resp.data.member_list.length) {
                for (let i in this.member_list.length) {
                  if (this.member_list[i] != resp.data.member_list[i]) {
                    is_list_same = false;
                    break;
                  }
                }
              } else is_list_same = false;
              if (!is_list_same) this.member_list = resp.data.member_list;
            } else this.member_list = resp.data.member_list;
            if (this.refresh_timer_id == null) {
              this.refresh_timer_id = setInterval(() => {
                //console.log("refresh data");
                this.refreshStatus();
              }, 8000);
            }
            this.getBossStatus();
            this.getInQueue();
            this.getSubscribes();
            this.getOnTree();
            this.getBattleStatus();
            this.getClanBattleDataNum();
            this.getAnlyzeData();
            this.getTodayRecords();
          } else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        });
    },
    getBossStatus() {
      //ElNotification.info("正在获取Boss信息")
      axios
        .get("api/clanbattle/boss_status", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0) {
            this.boss_status = resp.data.boss_status;
            if (this.clan_area != "cn") {
              let max_cycle = 1;
              for (let status of resp.data.boss_status) {
                if (status.target_cycle > max_cycle)
                  max_cycle = status.target_cycle;
              }
              this.max_boss_cycle = max_cycle;
            }
            else{
              this.max_boss_cycle = this.boss_status.target_cycle;
            }
          } else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        });
    },
    getClanInfo() {
      ElNotification.info("正在获取公会信息");
      axios
        .get("api/clanbattle/get_joined_clan")
        .then((resp) => {
          if (resp.data.err_code != 0) {
            ElNotification.info(
              "未登录，请先登录，如未设置密码请先向机器人发送“设置密码+密码”设置"
            );
            this.$router.push("/login");
            return;
          }
          this.joined_clan = resp.data.clan_list;
          if (this.selscted_clan != "") return;
          if (resp.data.clan_list.length == 0) {
            ElMessage.error("您还没有加入任何公会");
          } else if (resp.data.clan_list.length == 1) {
            this.selscted_clan = resp.data.clan_list[0];
          } else {
            this.chose_clan_dialog_visible = true;
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取加入公会信息失败，请尝试刷新页面");
        });
    },
    getBattleStatus() {
      axios
        .post("api/clanbattle/battle_status", this.query_challenge_status_form)
        .then((resp) => {
          if (resp.data.err_code == 0)
            this.battle_status_data = resp.data.status;
          else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    getClanBattleDataNum() {
      axios
        .get("api/clanbattle/current_clanbattle_data_num", {
          params: { clan_gid: this.selscted_clan },
        })
        .then((resp) => {
          if (resp.data.err_code == 0)
            this.current_clanbattle_data = resp.data.data_num;
          else this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("获取信息失败，请尝试刷新页面");
        });
    },
    updateAnalyzeData() {
      let full_data = this.full_clanbattle_analyze_data;
      //遍历并创建总记录
      let build_total_data_dict = {};
      for (let data_item of full_data) {
        if (data_item.member_uid == "admin") continue;
        if (
          !Object.prototype.hasOwnProperty.call(
            build_total_data_dict,
            data_item.member_uid
          )
        ) {
          build_total_data_dict[data_item.member_uid] = {
            uid: data_item.member_uid,
            total_damage: 0,
            full_challenge: 0,
            remain_challenge: 0,
          };
        }
        build_total_data_dict[data_item.member_uid]["total_damage"] +=
          data_item.damage;
        if (data_item.is_extra_time)
          build_total_data_dict[data_item.member_uid]["remain_challenge"] += 1;
        else build_total_data_dict[data_item.member_uid]["full_challenge"] += 1;
      }
      let build_total_data_list = [];
      for (let build_data in build_total_data_dict) {
        build_total_data_list.push(build_total_data_dict[build_data]);
      }
      this.full_clanbattle_analyze_clan_data_build = build_total_data_list;
    },
    destoryAnalyzeEcharts() {
      if (this.active_echarts != null) {
        for (let echart_inst of this.active_echarts) {
          echart_inst.dispose();
        }
        this.active_echarts = null;
      }
    },
    initAnalyzeEcharts() {
      if (this.active_analyze_enum_select == 2) {
        this.destoryAnalyzeEcharts();
        this.active_echarts = [];
        let personal_boss_damage_status_chart = echarts.init(
          document.getElementById("personal_boss_damage_status_chart")
        );
        this.active_echarts.push(personal_boss_damage_status_chart);
        let build_data_list = [0, 0, 0, 0, 0];
        for (let data_item of this.full_clanbattle_analyze_data) {
          if (data_item.member_uid == this.self_uid)
            build_data_list[data_item.target_boss - 1] += data_item.damage;
        }
        let option = {
          xAxis: {
            data: ["1王", "2王", "3王", "4王", "5王"],
          },
          yAxis: {
            axisLabel: {
              formatter: "",
              align: "center",
              // ...
            },
          },
          series: [
            {
              type: "bar",
              data: build_data_list,
              label: {
                show: true,
                formatter: (params) => {
                  return Math.floor((params.value / 10000) * 100) / 100 + "w";
                },
                position: "top",
              },
            },
          ],
        };
        personal_boss_damage_status_chart.setOption(option);
        let personal_boss_damage_in_clan_chart = echarts.init(
          document.getElementById("personal_boss_damage_in_clan_chart")
        );
        this.active_echarts.push(personal_boss_damage_in_clan_chart);
        let build_data_self_in_clan_list = [0, 0]; //自己，其余人
        for (let data_item of this.full_clanbattle_analyze_data) {
          if (data_item.member_uid == "admin") continue;
          if (data_item.member_uid == this.self_uid)
            build_data_self_in_clan_list[0] += data_item.damage;
          else build_data_self_in_clan_list[1] += data_item.damage;
        }
        let self_in_clan_option = {
          series: [
            {
              type: "pie",
              data: [
                {
                  value: build_data_self_in_clan_list[0],
                  name: "自己",
                },
                {
                  value: build_data_self_in_clan_list[1],
                  name: "其余人",
                },
              ],
              label: {
                show: true,
                formatter: (params) => {
                  return params.percent + "%-" + params.name;
                },
                position: "inside",
              },
            },
          ],
        };
        personal_boss_damage_in_clan_chart.setOption(self_in_clan_option);
      }
    },
    getAnlyzeData() {
      let query_form = {
        clan_gid: this.selscted_clan,
        date: "",
        member: "",
        boss: "",
        cycle: "",
      };
      axios
        .post("api/clanbattle/query_record", query_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            this.full_clanbattle_analyze_data = resp_data.record;
            this.updateAnalyzeData();
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
        });
    },
    getFormHeight() {
      this.record_table_height = window.innerHeight - 285.5 + "px";
      this.status_table_height = window.innerHeight - 285.5 + "px";
      this.subs_table_height = window.innerHeight - 274 + "px";
      if (this.active_echarts != null) {
        for (let chart of this.active_echarts) {
          chart.resize();
        }
      }
    },
    getCnTime(utcTime) {
      let date = new Date(utcTime);
      date.setHours(date.getHours() + 8);
      return date.toLocaleString();
    },
    selectAllNoticeMember() {
      if (this.query_challenge_status_form.date != null) return;
      for (let status of this.battle_status_data) {
        if (status.today_challenged < 3)
          this.notice_challenge_form.notice_member[status.uid] = true;
      }
    },
    clearSelectAllNoticeMember() {
      for (let key in this.notice_challenge_form.notice_member) {
        this.notice_challenge_form.notice_member[key] = false;
      }
    },
    reportNoticeMember() {
      this.disable_api_call = true;
      axios
        .post("api/clanbattle/notice_member", this.notice_challenge_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            ElMessage.success("提醒成功");
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    reportRemoveMember() {
      this.disable_api_call = true;
      if (
        !this.remove_member_form.remove_member ||
        this.remove_member_form.remove_member == ""
      ) {
        ElMessage.error("请选择成员");
        this.disable_api_call = false;
        return;
      }
      axios
        .post("api/clanbattle/remove_clan_member", this.remove_member_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            this.remove_member_form.remove_member = null;
            ElMessage.success("移除成员成功");
          }
          this.disable_api_call = false;
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
          this.disable_api_call = false;
        });
    },
    query_record_confirm() {
      axios
        .post("api/clanbattle/query_record", this.query_record_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            this.query_record_result_data = resp_data.record;
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("网络错误");
        });
    },
    clear_query_record_form() {
      this.query_record_form.date = "";
      this.query_record_form.member = "";
      this.query_record_form.boss = "";
      this.query_record_form.cycle = "";
    },
    handleQueryChallengeDataChange() {
      this.getBattleStatus();
      this.getTodayRecords();
    },
    handleMenuSelect(key) {
      this.active_enum_select = key;
    },
    handleSubMenuSelect(key) {
      this.active_sub_enum_select = key;
    },
    handleAlyzeMenuSelect(key) {
      this.active_analyze_enum_select = key;
    },
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    logout() {
      document.cookie = "session=0;expires=-1";
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
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
.el-table thead.is-group th {
  background-color: #ffffff !important;
}
</style>