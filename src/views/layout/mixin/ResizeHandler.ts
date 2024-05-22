import { useRoute } from "vue-router";
import { watch, onBeforeMount, onMounted} from "vue";
import pinia from '@/store/index'
import { useAppStore } from "@/store/modules/appStore";
const AppStore = useAppStore(pinia);

const { body } = document;
const WIDTH = 1024;
const RATIO = 3;

export default () => {
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      if (AppStore.device === "mobile" && AppStore.sidebar.opened) {
        AppStore.closeSidebar(false);
      }
    }
  ),
    onBeforeMount(() => {
      window.addEventListener("resize", _resizeHandler);
    });
  onMounted(() => {
    const isMobile = _isMobile();
    if (isMobile) {
      AppStore.toggleDevice("mobile");
      AppStore.closeSidebar(true);
    }
  });
  const _isMobile = () => {
    const rect = body.getBoundingClientRect();
    return rect.width - RATIO < WIDTH;
  };
  const _resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = _isMobile();
      AppStore.toggleDevice(isMobile ? "mobile" : "desktop");
      if (isMobile) {
        AppStore.closeSidebar(true);
      }
    }
  };
};
