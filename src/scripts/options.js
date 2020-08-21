import ext from "./utils/ext";
import storage from "./utils/storage";

ext.tabs.getAllInWindow(function(tabs){
  var displayContainer = document.getElementById("tabitmes");
  let tabsItems=[];
  storage.get('coding_tabsItems',function(data){
    let tabshmtl="";
      tabs.forEach((tab,index)=>{
        let oldSaveItem=data.coding_tabsItems?data.coding_tabsItems.find(o=>o.id==tab.id):null;
        console.log(oldSaveItem);
        tabsItems.push({
          id:tab.id,
          time:oldSaveItem?oldSaveItem.time:0,
          enable:oldSaveItem?oldSaveItem.enable:""
        });
        tabshmtl+=`
        <tr>
            <td>${index+1}</td>
            <td><input class="timecount" value="${oldSaveItem?oldSaveItem.time:0}" id="${'time_'+tab.id}"/></td>
            <td>
              <input class="enable-tab" type="checkbox" ${oldSaveItem?oldSaveItem.enable:""} id="${'enable_'+tab.id}"/>
            </td>
          </tr>
        `;
      });
    displayContainer.innerHTML = tabshmtl;
    storage.set({coding_tabsItems:tabsItems});
    //添加监听事件
    if(tabsItems){
      //刷新频率
      let timeItems=document.querySelectorAll(".timecount");
      let enableItems=document.querySelectorAll(".enable-tab");
      timeItems.forEach(function(el) {
        el.onchange=function(v){
          updateTabReshTimes(v.target.id.replace("time_",""),v.target.value);
        }
      });
      enableItems.forEach(function(el) {
        el.addEventListener("click", function(v) {
          console.log(v);
          updateTabReshEnable(v.target.id.replace("enable_",""),v.target.checked);
        })
      });
    }
  });
});
//修改刷新时间
function updateTabReshTimes(id,v){
  storage.get('coding_tabsItems',function(datas){
    let items=datas.coding_tabsItems?datas.coding_tabsItems:[];
    items.forEach(i=>{
      if(i.id==id){
        i.time=parseInt(v);
      }
    });
    storage.set({coding_tabsItems:items},function(){
      ext.runtime.sendMessage({ action: "tab-refresh"},function(response){
        console.log(response);
      });
    });
  });
}
//修改是否启用
function updateTabReshEnable(id,v){
  storage.get('coding_tabsItems',function(datas){
    let items=datas.coding_tabsItems?datas.coding_tabsItems:[];
    items.forEach(i=>{
      if(i.id==id){
        i.enable=v?"checked":"";
      }
    });
    storage.set({coding_tabsItems:items},function(){
      ext.runtime.sendMessage({ action: "tab-refresh"},function(response){
        console.log(response);
      });
    });
  });
}




