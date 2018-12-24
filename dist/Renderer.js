class Renderer {
    constructor(){
    }
    renderData(allCityData) {
        $(".cities-container").empty();
        const source = $('#cities-template').html();
        let template = Handlebars.compile(source);
        let newHTML = template({allCityData});
        $(".cities-container").append(newHTML)
    }
}