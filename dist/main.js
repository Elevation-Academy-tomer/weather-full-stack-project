const renderer = new Renderer()
const tempManager = new TempManager(renderer)

$( document ).ready(function() {
    loadPage()
});


const loadPage = function(){
    tempManager.getDataFromDB()
}

const handleSearch = async function(){
    let input = $("#cityName").val()
    tempManager.getCityData(input)
}

$("body").on("click", ".save", function(){
   let name =  $(this).siblings(".temAnName").find(".name").text()
   tempManager.saveCity(name)
})

$("body").on("click", ".delete", function(){
    let name =  $(this).siblings(".temAnName").find(".name").text()
    tempManager.removeCity(name)
 })

 $("body").on("click", ".fa-sync-alt", function(){
    let name =  $(this).siblings(".temAnName").find(".name").text()
    tempManager.updateCity(name)
 })

 $("#cityName").keypress(function (e) {
    const key = e.which;
    if (key == 13)
    {
        $(".fa-search").trigger("click")
    }
 });