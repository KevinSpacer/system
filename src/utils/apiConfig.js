// 本地storage
// 授权参数名
let authName = "Web-Auth-Token";
// 切换语言参数
let languageName = "web-language";
// 服务器地址参数名
const storeage_service_name = "web-service";

// 分离IP端口
const splitIpPort = (url) => {
  const urls = url.split("/");
  const [httpName] = urls;
  let service = urls[2] || "";
  // IP
  let ip = "";
  // 端口
  let port = "";
  if (service.indexOf(":") !== -1) {
    const ips = service.split(":");
    ip = ips[0];
    port = `:${ips[1]}`;
  } else {
    ip = service;
  }

  return {
    ip: `${httpName}//${ip}`,
    port,
  };
};

// 缓存路径
const storeage_service = window.localStorage.getItem(storeage_service_name);
const servicePort = ":7001";
// 服务器配置
const config = {
  // 线上
  online() {
    const ipPort = splitIpPort(storeage_service || "");
    // console.log(ipPort)

    // 请求IP 前置
    let serveIP = storeage_service ? ipPort.ip : "http://127.0.0.1";
    // 本地API端口
    let port = storeage_service ? ipPort.port || servicePort : servicePort;
    // 接口名 前置
    // 使用场景
    let scene = "system";
    // 版本
    let verison = "v1";
    let prefix = `${scene}/${verison}`;
    let prefixName = `${port}/${prefix}`;

    // 本地文件预览
    let previewFilePort = ":7004";
    let previewFilePerfix = `${previewFilePort}/oss/v1/open/file/preview/`;

    // 本地文件上传
    let uploadFilePerfix = `${previewFilePort}/oss/v1/open/file/upload`;

    return {
      serveIP,
      port,
      scene,
      prefix,
      prefixName,
      //接口
      serveUrl: serveIP + `${port}/`,
      // 上传图片
      updateFileUrl: serveIP + `${uploadFilePerfix}`,
      // 预览图片
      previewFileUrl: serveIP + `${previewFilePerfix}`,
      // 压缩图片
      zipImageUrl: serveIP + `${prefixName}/v1/filePreviewCustom/`,
    };
  },
  // 本地
  local() {
    const ipPort = splitIpPort(storeage_service || "");
    // console.log(ipPort)

    // 请求IP 前置
    let serveIP = storeage_service ? ipPort.ip : "http://127.0.0.1";
    // 本地API端口
    let port = storeage_service ? ipPort.port || servicePort : servicePort;
    // 接口名 前置
    // 使用场景
    let scene = "system";
    // 版本
    let verison = "v1";
    let prefix = `${scene}/${verison}`;
    let prefixName = `${port}/${prefix}`;

    // 本地文件预览
    let previewFilePort = ":7004";
    let previewFilePerfix = `${previewFilePort}/oss/v1/open/file/preview/`;

    // 本地文件上传
    let uploadFilePerfix = `${previewFilePort}/oss/v1/open/file/upload`;
    // 文件下载
    const donwLoadFileUrl = `${serveIP}${previewFilePort}/oss/v1/open/file/download/`;

    return {
      serveIP,
      port,
      scene,
      prefix,
      prefixName,
      //接口
      serveUrl: serveIP + `${port}/`,
      // 上传图片
      updateFileUrl: serveIP + `${uploadFilePerfix}`,
      // 预览图片
      previewFileUrl: serveIP + `${previewFilePerfix}`,
      // 压缩图片
      zipImageUrl: serveIP + `${prefixName}/v1/filePreviewCustom/`,
      donwLoadFileUrl,
    };
  },
};

module.exports = {
  ...config["local"](),
  languageName,
  authName,
  storeage_service_name,
};
