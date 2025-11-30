import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 面试状态类型
export interface InterviewStatus {
  id: string;
  name: string;
  color: string;
}

// 面试项目类型
export interface InterviewItem {
  id: string;
  company: string;
  position: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  // 新增：岗位详细链接
  positionLink?: string;
}

// 面试详情数据类型
export interface InterviewDetail {
  id: string;
  company: string;
  position: string;
  interviewStatus: string;
  preparationDocs: {
    title: string;
    text: string;
  };
  interviewDocs: Array<{
    title: string;
    text: string;
  }>;
  impressionIndex: number;
  notes: string;
}

// 预定义面试状态
export const PREDEFINED_STATUS: InterviewStatus[] = [
  { id: "applied", name: "已投递", color: "#909399" },
  { id: "waiting-first", name: "等待一面", color: "#e6a23c" },
  { id: "waiting-second", name: "等待二面", color: "#e6a23c" },
  { id: "waiting-third", name: "等待三面", color: "#e6a23c" },
  { id: "first-pass", name: "一面通过", color: "#67c23a" },
  { id: "second-pass", name: "二面通过", color: "#67c23a" },
  { id: "third-pass", name: "三面通过", color: "#67c23a" },
  { id: "offer", name: "已获Offer", color: "#409eff" },
  { id: "rejected", name: "已拒绝", color: "#f56c6c" },
];

export const useInterviewStore = defineStore(
  "interview",
  () => {
    // 状态
    const items = ref<InterviewItem[]>([]);
    const customStatus = ref<InterviewStatus[]>([]);
    const interviewDetails = ref<Map<string, InterviewDetail>>(new Map());

    // Getters
    const allStatus = computed(() => [
      ...PREDEFINED_STATUS,
      ...customStatus.value,
    ]);

    // Actions
    function addItem(
      item: Omit<InterviewItem, "id" | "createdAt" | "updatedAt">
    ) {
      const newItem: InterviewItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      items.value.push(newItem);
    }

    function updateStatus(id: string, status: string) {
      const item = items.value.find((item) => item.id === id);
      if (item) {
        item.status = status;
        item.updatedAt = new Date();
      }
    }

    function addCustomStatus(status: Omit<InterviewStatus, "id">) {
      const newStatus: InterviewStatus = {
        ...status,
        id: Date.now().toString(),
      };
      customStatus.value.push(newStatus);
      return newStatus;
    }

    function deleteItem(id: string) {
      items.value = items.value.filter((item) => item.id !== id);
      interviewDetails.value.delete(id);
    }

    function getItemById(id: string) {
      return items.value.find((item) => item.id === id);
    }

    function getInterviewDetail(id: string) {
      let detail = interviewDetails.value.get(id);
      const item = getItemById(id);
      if (!detail) {
        // 如果没有详情，创建默认详情
        detail = {
          id,
          company: item?.company || "",
          position: item?.position || "",
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
        };
        interviewDetails.value.set(id, detail);
      } else if (item) {
        // 如果已有详情，同步最新的公司名称和岗位名称
        detail.company = item.company;
        detail.position = item.position;
        interviewDetails.value.set(id, detail);
      }
      return detail;
    }

    function updateInterviewDetail(detail: InterviewDetail) {
      interviewDetails.value.set(detail.id, detail);
    }

    return {
      items,
      customStatus,
      interviewDetails,
      allStatus,
      addItem,
      updateStatus,
      addCustomStatus,
      deleteItem,
      getItemById,
      getInterviewDetail,
      updateInterviewDetail,
    };
  },
  {
    // 持久化配置
    persist: {
      key: "interview-assistant",
      storage: localStorage,
      // 自定义序列化和反序列化，处理Map类型
      serializer: {
        serialize: (value) => {
          const serialized = {
            ...value,
            interviewDetails: Array.from(value.interviewDetails.entries()),
          };
          return JSON.stringify(serialized);
        },
        deserialize: (value) => {
          const deserialized = JSON.parse(value);
          if (deserialized.interviewDetails) {
            deserialized.interviewDetails = new Map(
              deserialized.interviewDetails
            );
          }
          return deserialized;
        },
      },
    },
  }
);
