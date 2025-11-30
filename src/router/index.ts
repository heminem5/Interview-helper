import { createRouter, createWebHistory } from "vue-router";
import AppRoot from "../AppRoot.vue";
import Home from "../App.vue";
import InterviewDetail from "../components/InterviewDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppRoot,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "detail/:id",
          name: "detail",
          component: InterviewDetail,
        },
      ],
    },
  ],
});

export default router;
