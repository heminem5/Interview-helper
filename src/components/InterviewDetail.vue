<template>
  <div class="interview-detail">
    <!-- 顶部导航 -->
    <header class="detail-header">
      <el-button type="primary" @click="goBack">
        <el-icon><Back /></el-icon> 返回列表
      </el-button>
      <h2 class="detail-title">面试详情</h2>
    </header>

    <!-- 面试详情表单 -->
    <main class="detail-main">
      <el-card class="detail-card">
        <el-form
          label-position="top"
          :model="interviewData"
          label-width="120px"
        >
          <!-- 基本信息 -->
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称">
                <el-input
                  v-model="interviewData.company"
                  placeholder="请输入公司名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位名称">
                <el-input
                  v-model="interviewData.position"
                  placeholder="请输入岗位名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="面试状态">
                <el-select
                  v-model="interviewData.interviewStatus"
                  placeholder="请选择面试状态"
                >
                  <el-option
                    v-for="status in interviewStore.allStatus"
                    :key="status.id"
                    :label="status.name"
                    :value="status.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 意向指数 -->
          <el-form-item label="意向指数（满分10分）">
            <el-input-number
              v-model="interviewData.impressionIndex"
              :min="0"
              :max="10"
              :step="1"
              placeholder="请输入意向指数"
            ></el-input-number>
          </el-form-item>

          <!-- 面试记录 -->
          <el-divider content-position="left">面试记录</el-divider>
          <div
            v-for="(doc, index) in interviewData.interviewDocs"
            :key="index"
            class="interview-doc-item"
          >
            <h4>面试记录 {{ index + 1 }}</h4>
            <el-form-item label="标题">
              <el-input
                v-model="doc.title"
                placeholder="请输入面试记录标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <v-md-editor
                v-model="doc.text"
                :height="400"
                :auto-height="true"
              ></v-md-editor>
            </el-form-item>
            <el-button
              type="danger"
              size="small"
              @click="removeInterviewDoc(index)"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-divider />
          </div>
          <el-button
            type="primary"
            size="small"
            @click="addInterviewDoc"
            class="add-doc-btn"
          >
            <el-icon><Plus /></el-icon> 添加面试记录
          </el-button>

          <!-- 备注 -->
          <el-divider content-position="left">备注</el-divider>
          <el-form-item label="备注">
            <el-input
              v-model="interviewData.notes"
              type="textarea"
              :rows="4"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" @click="saveChanges"
                >保存修改</el-button
              >
              <el-button @click="cancelEdit">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Back, Delete, Plus } from "@element-plus/icons-vue";
import { useInterviewStore } from "../stores/interview";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const interviewStore = useInterviewStore();

// 面试数据
const interviewData = ref({
  id: "",
  company: "",
  position: "",
  interviewStatus: "面试中",
  preparationDocs: {
    title: "",
    text: "",
  },
  interviewDocs: [
    {
      title: "",
      text: "",
    },
  ],
  impressionIndex: 0,
  notes: "",
});

// 初始数据（用于重置）
const initialData = ref({ ...interviewData.value });

// 根据ID获取面试项目
const getInterviewById = (id: string) => {
  // 从store中获取对应ID的面试详情
  const detail = interviewStore.getInterviewDetail(id);
  if (detail) {
    interviewData.value = { ...detail };
    initialData.value = { ...detail };
  }
};

// 返回列表页
const goBack = () => {
  router.push("/");
};

// 保存修改
const saveChanges = () => {
  // 更新store中的面试详情
  interviewStore.updateInterviewDetail(interviewData.value);
  ElMessage.success("保存成功");
  initialData.value = { ...interviewData.value };
};

// 取消编辑
const cancelEdit = () => {
  interviewData.value = { ...initialData.value };
  ElMessage.info("已取消编辑");
};

// 添加面试记录
const addInterviewDoc = () => {
  interviewData.value.interviewDocs.push({
    title: "",
    text: "",
  });
};

// 删除面试记录
const removeInterviewDoc = (index: number) => {
  if (interviewData.value.interviewDocs.length > 1) {
    interviewData.value.interviewDocs.splice(index, 1);
    ElMessage.success("删除成功");
  } else {
    ElMessage.warning("至少需要保留一条面试记录");
  }
};

// 组件挂载时获取面试数据
onMounted(() => {
  const id = route.params.id as string;
  interviewData.value.id = id;
  getInterviewById(id);
});
</script>

<style scoped>
.interview-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.detail-title {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.detail-main {
  margin-top: 20px;
}

.detail-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.interview-doc-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.interview-doc-item h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.add-doc-btn {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}
</style>
