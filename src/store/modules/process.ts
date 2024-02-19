import { defineStore } from 'pinia';

export const useProcessStore = defineStore('processStore', {
  state: () => ({
    tableId: '',
    isTried: false,
    promoterDrawer: false,
    flowPermission1: {},
    approverDrawer: false,
    approverConfig1: {},
    copyerDrawer: false,
    copyerConfig1: {},
    conditionDrawer: false,
    conditionsConfig1: {
      conditionNodes: [],
    },
  }),
  actions: {
    setTableId(payload:any) {
      this.tableId = payload
    },
    setIsTried(payload:any) {
      this.isTried = payload
    },
    setPromoter(payload:any) {
      this.promoterDrawer = payload
    },
    setFlowPermission(payload:any) {
      this.flowPermission1 = payload
    },
    setApprover(payload:any) {
      this.approverDrawer = payload
    },
    setApproverConfig(payload:any) {
      this.approverConfig1 = payload
    },
    setCopyer(payload:any) {
      this.copyerDrawer = payload
    },
    setCopyerConfig(payload:any) {
      this.copyerConfig1 = payload
    },
    setCondition(payload:any) {
      this.conditionDrawer = payload
    },
    setConditionsConfig(payload:any) {
      this.conditionsConfig1 = payload
    },
  }
})