import ext from "./utils/ext";
import storage from "./utils/storage";
ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", request.data);
      sendResponse({ action: "saved" });
    }else if(request.action === "tab-refresh"){
      tabRefresh();
      sendResponse({ action: "tab-refreshed" })
    }
  }
);

var tabRefreshData=[];
function tabRefresh(){
  ext.tabs.getAllInWindow(function(tabs){
    storage.get('coding_tabsItems',function(data){
      let storageItems=data.coding_tabsItems||[];
      tabs.forEach(tab=>{
        let storItemConfig=storageItems.find(o=>o.id==tab.id);
         //设置新得定时器
        let oldIntervalItem=tabRefreshData.find(o=>o.id==tab.id);
        if(oldIntervalItem){
          clearInterval(tabRefreshData.find(o=>o.id==tab.id).intervalID);//清空掉之前的循环ID
        }
        if(storItemConfig){
          if(storItemConfig.enable=="checked"&&storItemConfig.time!=0){
            let tabSetTime=setInterval(() => {
              ext.tabs.reload(tab.id);
            }, storItemConfig.time*1000);
            if(oldIntervalItem){
              oldIntervalItem.intervalID=tabSetTime;
            }else{
              tabRefreshData.push({
                id:tab.id,
                intervalID:tabSetTime
              });
            }
          }
        }
      });
    });
  });
}


