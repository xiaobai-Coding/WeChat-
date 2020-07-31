export default [
  {
    path: "/invoiceList/:sid",
    name: "invoiceList",
    component: () => import("@/views/invoice/invoiceList"),
    meta: {
      title: "开票",
    },
  },
  {
    path: "/invoiceList/:sid/invoiceDetail/drawInvoice",
    name: "drawInvoice",
    component: () => import("@/views/invoice/drawInvoice"),
    meta: {
      keepAlive: false,
      title: "发票",
      routerAlive: false,
    },
  },
  {
    path: "/invoiceList/:sid/invoiceDetail",
    name: "invoiceDetail",
    component: () => import("@/views/invoice/invoiceDetail"),
    meta: {
      keepAlive: false,
      title: "开票详情页",
      routerAlive: false,
    },
  },
  {
    path: "/invoiceList/:sid/drawDetail",
    name: "drawDetail",
    component: () => import("@/views/invoice/drawDetail"),
    meta: {
      keepAlive: false,
      title: "已开票详情预览",
      routerAlive: false,
    },
  },
];
