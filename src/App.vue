<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <h1>面试助手</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon> 添加面试项目
      </el-button>
    </header>

    <!-- 面试项目列表 -->
    <main class="interview-list">
      <div class="interview-grid">
        <!-- 面试卡片 -->
        <el-card
          v-for="item in interviewStore.items"
          :key="item.id"
          class="interview-card"
        >
          <template #header>
            <div class="card-header" @click="showDetail(item)">
              <h3>{{ item.company }}</h3>
              <el-tag :type="getStatusColor(item.status)" size="small">
                {{ getStatusName(item.status) }}
              </el-tag>
            </div>
          </template>
          <div class="card-content" @click="showDetail(item)">
            <p class="position">{{ item.position }}</p>
            <!-- 显示岗位链接 -->
            <p v-if="item.positionLink" class="position-link">
              <el-link
                :href="item.positionLink"
                target="_blank"
                type="primary"
                :underline="false"
              >
                <el-icon><Link /></el-icon> 查看岗位详情
              </el-link>
            </p>
            <div class="update-time">
              更新时间：{{ formatDate(item.updatedAt) }}
            </div>
          </div>
          <!-- 状态切换下拉框 -->
          <div class="status-selector" @click.stop>
            <el-select
              v-model="item.status"
              placeholder="切换状态"
              size="small"
              @change="updateStatus(item.id, item.status)"
            >
              <el-option
                v-for="status in interviewStore.allStatus"
                :key="status.id"
                :label="status.name"
                :value="status.id"
              ></el-option>
            </el-select>
          </div>
        </el-card>

        <!-- 空状态 -->
        <div v-if="interviewStore.items.length === 0" class="empty-state">
          <el-empty description="暂无面试记录，点击右上角添加"></el-empty>
        </div>
      </div>
    </main>

    <!-- 添加面试对话框 -->
    <el-dialog v-model="showAddDialog" title="添加面试" width="500px">
      <el-form>
        <el-form-item label="公司名称" required>
          <el-input
            v-model="newItem.company"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位名称" required>
          <el-input
            v-model="newItem.position"
            placeholder="请输入岗位名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位详细链接">
          <el-input
            v-model="newItem.positionLink"
            placeholder="请输入岗位详情链接（可选）"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始状态">
          <el-select v-model="newItem.status" placeholder="请选择初始状态">
            <el-option
              v-for="status in interviewStore.allStatus"
              :key="status.id"
              :label="status.name"
              :value="status.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="addItem">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Plus, Link } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useInterviewStore } from "./stores/interview";

const router = useRouter();

// Store
const interviewStore = useInterviewStore();

// 状态管理
const showAddDialog = ref(false);
const newItem = ref({
  company: "",
  position: "",
  positionLink: "",
  status: "applied",
});

// 添加面试项目
const addItem = () => {
  if (!newItem.value.company || !newItem.value.position) {
    return;
  }
  interviewStore.addItem(newItem.value);
  // 重置表单
  newItem.value = {
    company: "",
    position: "",
    positionLink: "",
    status: "applied",
  };
  showAddDialog.value = false;
};

// 更新状态
const updateStatus = (id: string, status: string) => {
  interviewStore.updateStatus(id, status);
};

// 获取状态名称
const getStatusName = (statusId: string) => {
  const status = interviewStore.allStatus.find((s) => s.id === statusId);
  return status?.name || statusId;
};

// 获取状态颜色
const getStatusColor = (statusId: string) => {
  const status = interviewStore.allStatus.find((s) => s.id === statusId);
  return status?.color || "#909399";
};

// 显示详情
const showDetail = (item: any) => {
  router.push(`/detail/${item.id}`);
};

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString();
};
</script>

<style scoped>
/* 确保页面从顶部开始 */
body {
  margin: 0;
  padding: 0;
}

.app-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* 页面顶部标题栏 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  /* 确保标题栏在最顶部 */
  position: sticky;
  top: 0;
  z-index: 100;
  padding-top: 10px;
}

.app-header h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
  font-weight: bold;
}

.interview-list {
  width: 100%;
}

/* 横向网格布局 */
.interview-grid {
  display: grid;
  /* 优化网格参数，更适合横向展示 */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  /* 确保网格占满宽度 */
  width: 100%;
}

.interview-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.interview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.card-content {
  margin: 15px 0;
}

.position {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #606266;
}

.update-time {
  font-size: 12px;
  color: #909399;
}

.status-selector {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
}
</style>
