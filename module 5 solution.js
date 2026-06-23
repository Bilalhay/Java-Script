(function (global) {

var dc = {};

var homehtmlurl = "snippets/home-snippet.html";
var allcategoriesurl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var menuitemsurl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/",
    menuitemshtmlurl = "snippets/menu-items.html",
    menuitemstitlehtmlurl = "snippets/menu-items-title.html";

var inserthtml = function (selector, html) {
  var targetelem = document.querySelector(selector);
  targetelem.innerHTML = html;
};

var showloading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  inserthtml(selector, html);
};

var insertproperty = function (string, propname, propvalue) {
  var proptoreplace = "{{" + propname + "}}";
  string = string.replace(new RegExp(proptoreplace, "g"), propvalue);
  return string;
};

var switchmenutoactive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

document.addEventListener("DOMContentLoaded", function (event) {
  showloading("#main-content");
  $ajaxUtils.sendGetRequest(
    allcategoriesurl,
    buildandshowhomehtml,
    true);
});

function buildandshowhomehtml (categories) {
  $ajaxUtils.sendGetRequest(
    homehtmlurl,
    function (homehtml) {
      var chosencategory = chooserandomcategory(categories);
      var chosencategoryshortname = chosencategory.short_name;

      var homehtmltochooserandomcategory = insertproperty(homehtml, "randomCategoryShortName", "'" + chosencategoryshortname + "'");

      inserthtml("#main-content", homehtmltochooserandomcategory);
    },
    false);
}

function chooserandomcategory (categories) {
  var randomarrayindex = Math.floor(Math.random() * categories.length);
  return categories[randomarrayindex];
}

dc.loadMenuCategories = function () {
  showloading("#main-content");
  $ajaxUtils.sendGetRequest(
    allcategoriesurl,
    buildandshowcategorieshtml,
    true);
};

dc.loadMenuItems = function (categoryshort) {
  showloading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuitemsurl + categoryshort + ".json",
    buildandshowmenuitemshtml,
    true);
};

function buildandshowcategorieshtml (categories) {
  $ajaxUtils.sendGetRequest(
    "snippets/categories-title-snippet.html",
    function (categoriestitlehtml) {
      $ajaxUtils.sendGetRequest(
        "snippets/category-snippet.html",
        function (categorysnippethtml) {
          switchmenutoactive();
          var categoriesviewhtml = buildcategoriesviewhtml(categories, categoriestitlehtml, categorysnippethtml);
          inserthtml("#main-content", categoriesviewhtml);
        },
        false);
    },
    false);
}

function buildcategoriesviewhtml(categories, categoriestitlehtml, categorysnippethtml) {
  var finalhtml = categoriestitlehtml;
  finalhtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categorysnippethtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertproperty(html, "name", name);
    html = insertproperty(html, "short_name", short_name);
    finalhtml += html;
  }

  finalhtml += "</section>";
  return finalhtml;
}

function buildandshowmenuitemshtml (categorymenuitems) {
  $ajaxUtils.sendGetRequest(
    menuitemstitlehtmlurl,
    function (menuitemstitlehtml) {
      $ajaxUtils.sendGetRequest(
        menuitemshtmlurl,
        function (menuitemshtml) {
          switchmenutoactive();
          var menuitemsviewhtml = buildmenuitemsviewhtml(categorymenuitems, menuitemstitlehtml, menuitemshtml);
          inserthtml("#main-content", menuitemsviewhtml);
        },
        false);
    },
    false);
}

function buildmenuitemsviewhtml(categorymenuitems, menuitemstitlehtml, menuitemshtml) {
  menuitemstitlehtml = insertproperty(menuitemstitlehtml, "name", categorymenuitems.category.name);
  menuitemstitlehtml = insertproperty(menuitemstitlehtml, "special_instructions", categorymenuitems.category.special_instructions);

  var finalhtml = menuitemstitlehtml;
  finalhtml += "<section class='row'>";

  var menuitems = categorymenuitems.menu_items;
  var catshortname = categorymenuitems.category.short_name;
  for (var i = 0; i < menuitems.length; i++) {
    var html = menuitemshtml;
    html = insertproperty(html, "short_name", menuitems[i].short_name);
    html = insertproperty(html, "catShortName", catshortname);
    html = insertitemprice(html, "price_small", menuitems[i].price_small);
    html = insertitemportionname(html, "small_portion", menuitems[i].small_portion);
    html = insertitemprice(html, "price_large", menuitems[i].price_large);
    html = insertitemportionname(html, "large_portion", menuitems[i].large_portion);
    html = insertproperty(html, "name", menuitems[i].name);
    html = insertproperty(html, "description", menuitems[i].description);

    if (i % 2 !== 0) {
      html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalhtml += html;
  }

  finalhtml += "</section>";
  return finalhtml;
}

function insertitemprice(html, pricepropname, pricevalue) {
  if (!pricevalue) {
    return insertproperty(html, pricepropname, "");
  }
  pricevalue = "$" + pricevalue.toFixed(2);
  html = insertproperty(html, pricepropname, pricevalue);
  return html;
}

function insertitemportionname(html, portionpropname, portionvalue) {
  if (!portionvalue) {
    return insertproperty(html, portionpropname, "");
  }
  portionvalue = "(" + portionvalue + ")";
  html = insertproperty(html, portionpropname, portionvalue);
  return html;
}

global.$dc = dc;

})(window);
