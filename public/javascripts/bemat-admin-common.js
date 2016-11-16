function uniqId() {
    var e = new Date;
    e.getMilliseconds();
    return Math.round((new Date).getTime() + 1e3 * Math.random())
}

function rand(e, n) {
    var o = arguments.length;
    if (0 === o) e = 0, n = 2147483647;
    else if (1 === o) throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");
    return Math.floor(Math.random() * (n - e + 1)) + e
}

function typeOf(e) {
    return {}.toString.call(e).split(" ")[1].slice(0, -1).toLowerCase()
}
$(function() {
    "use strict";
    var App = function() {
            var e = this;
            $(document).ready(function() {
                e.init()
            })
        },
        cc = App.prototype;
    cc.init = function() {
        AppPreload.init(), AppAjaxNavigation.init(), AppHeader.init(), AppSidebar.init(), AppOnLoad.init()
    };
    var $body = $("body"),
        $document = $(document),
        $window = $(window);
    $.page = $("#page-wrapper"), $.sidebar = $("#left-content"), $.sidebarToggle = $("#sidebar-toggle"), $.mainContent = $("#right-content"), $.appComponents = [], $.appFeatures = [], $.ajaxContainer = $("#right-content-wrapper .right-content-outter .right-content-inner");
    var AppFeatures = {
            init: function() {
                $.appFeatures = [{
                    name: "idletimer",
                    feature: "AppFeatures.idleTimer"
                }, {
                    name: "hierarchicaldisplay",
                    feature: "AppFeatures.hierachicalDisplay"
                }, {
                    name: "prettyPrint",
                    feature: "AppFeatures.prettyPrint"
                }, {
                    name: "materialSelect",
                    feature: "AppFeatures.materialSelect"
                }]
            },
            breakpoints: function() {
                var e = '<div id="ScreenSize" class="device-breakpoints"><div class="visible-xs" data-breakpoint="xs">XS</div><div class="visible-sm" data-breakpoint="sm">SM</div><div class="visible-md" data-breakpoint="md">MD</div><div class="visible-lg" data-breakpoint="lg">LG</div></div>';
                $body.prepend(e)
            },
            windowResize: function() {
                $window.on("load resize", function() {
                    var e = "",
                        n = 0;
                    Modernizr.mq("(min-width: 1200px)") ? (e = "LG", n = 5) : Modernizr.mq("(min-width: 992px)") ? (e = "MD", n = 4) : Modernizr.mq("(min-width: 768px)") ? (e = "SM", n = 3) : Modernizr.mq("(min-width: 480px)") ? (e = "XS", n = 2) : Modernizr.mq("(max-width: 480px)") && (e = "XXS", n = 1), $body.removeClass("bematScreenLG bematScreenMD bematScreenSM bematScreenXS bematScreenXXS").addClass("bematScreen" + e), $.event.trigger({
                        type: "bemat-screen-resize",
                        size: e,
                        index: n
                    })
                })
            },
            idleTimer: function() {
                $.idle && ($document.idleTimer({
                    timeout: $.idleTimeout,
                    idle: !0
                }), $document.on("idle.idleTimer", function(e, n, o) {
                    $.event.trigger({
                        type: "idleOn"
                    })
                }), $document.on("active.idleTimer", function(e, n, o, a) {
                    $.event.trigger({
                        type: "idleOff"
                    })
                }))
            },
            hierachicalDisplay: function() {
                $('[data-animation="hierarchical-display"]').hierarchicalDisplay()
            },
            prettyPrint: function() {
                $("pre").addClass("prettyprint linenums"), prettyPrint()
            },
            clipboard: function() {},
            materialSelect: function() {
                $("select").selectpicker({
                    dropupAuto: !1,
                    size: 5
                })
            },
            appBackground: function() {
                if ($.appBackgroundImage) {
                    var e = {
                        "background-image": "url(/images/bgs/pattern/" + $.appBackgroundImage + ")",
                        "background-repeat": "repeat"
                    };
                    $("html").css(e)
                }
            }
        },
        AppPreload = {
            init: function() {
                AppAjaxNavigation.showPreloader(), AppPreload.loadScripts()
            },
            loadScripts: function() {
                var e = [],
                    n = [],
                    o = [];
                $LAB.script("/javascripts/bemat-config.js", "/javascripts/bemat-circularLoader.js", "/javascripts/bemat-components.js").wait(function() {
                    "array" == typeOf($.bematAppComponents) && ($.each($.bematAppComponents, function(a, t) {
                        if ("undefined" == typeOf(t.register) || 0 != t.register) {
                            var i = t.name,
                                r = t.component,
                                s = t.js,
                                d = t.css;
                            e.push({
                                name: i,
                                component: r
                            }), "undefined" != typeOf(s) && s.length > 0 && n.push(s), "undefined" != typeOf(d) && d.length > 0 && o.push(d)
                        }
                    }), $.appComponents = e, n = $.map(n, function(e) {
                        return e
                    }), o = $.map(o, function(e) {
                        return e
                    }))
                }).wait().script("vendor/lazyload/lazyload.js", "vendor/i18next/i18next.min.js", "vendor/i18next/i18nextXHRBackend.min.js", "vendor/i18next/i18next-jquery.min.js", "vendor/idle-timer/idle-timer.1.0.1.min.js", "vendor/perfectscrollbar/perfect-scrollbar.jquery.min.js", "vendor/tinycon/tinycon.min.js", "vendor/hierarchicaldisplay/jquery.zmd.hierarchical-display.min.js").wait(function() {
                    var e = ["vendor/flag-icon-css/flag-icon.min.css", "vendor/animations/animate.css", "vendor/hierarchicaldisplay/zmd.hierarchical-display.min.css"];
                    AppLoadScript.loadCSS(e)
                }).wait(function() {
                    $.demoMode && (console.log("[DEMO MODE] Loading demo settings"), $LAB.script("/javascripts/bemat-admin-demo.js"))
                }).wait(function() {
                    $LAB.script(n).wait(function() {
                        AppLoadScript.loadCSS(o)
                    }).wait(function() {
                        AppPreload.done()
                    })
                })
            },
            done: function() {
                AppComponents.init(), AppFeatures.init(), AppFeatures.idleTimer(), AppFeatures.appBackground(), $.event.trigger({
                    type: "scriptload",
                    message: "The system scripts has been fully loaded"
                })
            }
        },
        AppLanguage = {
            init: function() {
                $.appMultiLanguage && (i18next.use(window.i18nextXHRBackend).init({
                    load: "unspecific",
                    fallbackLng: $.appDefaultLanguage,
                    lng: $.appDefaultLanguage,
                    useDataAttrOptions: !0,
                    debug: !1,
                    backend: {
                        loadPath: "locales/{{lng}}.json",
                        addPath: "locales/add/{{lng}}/{{ns}}",
                        allowMultiLoading: !1
                    }
                }, function(e, n) {
                    i18nextJquery.init(i18next, $, {
                        useOptionsAttr: !0
                    }), AppLanguage.doLocale()
                }), $("#language-selector-list").on("click", "a", function(e) {
                    var n = $(this),
                        o = n.data("language");
                    i18next.changeLanguage(o, function(e, o) {
                        n.parents("ul").find("li").removeClass("active"), n.parent("li").addClass("active"), AppLanguage.doLocale()
                    })
                }))
            },
            doLocale: function() {
                $.appMultiLanguage && ($.isFunction($.fn.localize) ? $body.localize() : $.debug && console.log("[AppLanguage] .localize() Error."))
            }
        },
        AppAjaxNavigation = {
            init: function() {
                $.ajaxNav = !1, $.ajaxNavCircularLoader = $("#circular-loader"), $.preloaderActive, Modernizr.history && $.ajaxNavHtml5Mode ? $window.on("popstate", function(e) {
                    AppAjaxNavigation.checkURL()
                }) : $window.on("hashchange", function(e) {
                    $.ajaxNav ? (AppAjaxNavigation.checkURL(), $.ajaxNav = !1) : $.debug && console.log("[AjaxNAV] Ajax nav blocked")
                }), $document.on("click", '#sidebar a[target="_blank"]', function(e) {
                    e.preventDefault();
                    var n = $(e.currentTarget);
                    return window.open(n.attr("href")), !1
                }), $document.on("click", '#sidebar a[target="_top"]', function(e) {
                    e.preventDefault();
                    var n = $(e.currentTarget);
                    return window.location = n.attr("href"), console.log("SALIENDO"), !1
                }), $document.on("click", '#sidebar a[href="#"]', function(e) {
                    return e.preventDefault(), !1
                }), $document.on("click", '#sidebar a[href!="#"]', function(e) {
                    $.ajaxNav = !0, e.preventDefault();
                    var n = $(e.currentTarget),
                        o = window.location.hash,
                        a = window.location.search,
                        t = window.location.href,
                        i = t.replace(a, "").replace(o, "") + "#" + n.attr("href"),
                        r = n.attr("href");
                    if (n.attr("target")) window.setTimeout(function() {
                        if (Modernizr.history && $.ajaxNavHtml5Mode) history.pushState(null, null, r), AppAjaxNavigation.checkURL();
                        else {
                            a ? window.location.href = i : window.location.hash = r
                        }
                    }, 150);
                    else if (Modernizr.history && $.ajaxNavHtml5Mode) history.pushState(null, null, r), AppAjaxNavigation.checkURL();
                    else {
                        a ? window.location.href = i : window.location.hash = r
                    }
                })
            },
            materialPageTransition: function(e) {
                "boolean" == typeOf($.ajaxNavMaterialTransition) && (1 == e ? $.ajaxNavMaterialTransition = !0 : 0 == e && ($.ajaxNavMaterialTransition = !1))
            },
            locationProvider: function() {},
            checkURL: function() {
                /*if (Modernizr.history && $.ajaxNavHtml5Mode) var e = $("base"),
                    n = e.context.baseURI,
                    o = $(location).attr("href"),
                    a = o.replace(n, "");
                else {
                    var a = location.href.split("#").splice(1).join("#");
                    if (!a) try {
                        var t = window.document.URL;

                        t && t.indexOf("#", 0) > 0 && t.indexOf("#", 0) < t.length + 1 && (a = t.substring(t.indexOf("#", 0) + 1))
                    } catch (i) {}
                }!a && $.defaultHomePage && (a = $.defaultHomePage);
                var r = $(".right-content-inner");

                if (a) {
                    $("#sidebar li.active").removeClass("active"), $('#sidebar li:has(a[href="' + a + '"])').addClass("active");
                    var s = $('#sidebar a[href="' + a + '"]').attr("title");
                    document.title = s || document.title, AppAjaxNavigation.showPreloader(), AppAjaxNavigation.loadURL(a + location.search, r)
                } else {
                    var a = $('#sidebar > ul > li:first-child > a[href!="#"]'),
                        a = a.attr("href");
                    Modernizr.history && $.ajaxNavHtml5Mode ? (history.pushState(null, null, a), AppAjaxNavigation.checkURL(), a = null) : ($.ajaxNav = 1, window.location.hash = a, a = null)
                } */
                
            },
            loadURL: function(e, n) {
              /*e = "/dashboard"
              alert(e);
                $.debug && console.log("[AjaxNAV] Loading url: " + e), $.ajax({
                    type: "GET",
                    url: e,
                    dataType: "html",
                    cache: !0,
                    beforeSend: function() {
                        n.animate({
                            opacity: "1"
                        }, $.ajaxNavFadeDuration, function() {
                            if ("function" == typeof pageDestroy) try {
                                pageLoadScripts = void 0, pageRequiredComponents = void 0, doneScriptsLoad = void 0, pageRequiredFeatures = void 0, pageDestroy(), $.debug && console.log("[AjaxNAV] pageDestroy()")
                            } catch (e) {
                                pageDestroy = void 0, $.debug && console.error("[AjaxNAV] pageDestroy() Catch Error")
                            }
                        })
                    },
                    success: function(o) {
                        if ($.ajaxNavMaterialTransition) {
                            setTimeout(function() {
                                n.wrapInner('<div class="materialTransitionTranslateOut"></div>');
                                var a = (setTimeout(function() {
                                        $(".materialTransitionTranslateOut").addClass("out")
                                    }, 0), '<div class="newContainer mptIn"></div>'),
                                    a = $(a);
                                $("#right-content-wrapper .right-content-outter").prepend(a), a.html(o), AppAjaxNavigation.pageLoadedActions(pageLoadScripts, pageLoadCSS, pageRequiredComponents, pageRequiredFeatures), AppLanguage.doLocale();
                                setTimeout(function() {
                                    $(".newContainer").addClass("in"), $(".newContainer").onCSSTransitionEnd(function() {
                                        $(".newContainer").removeClass("newContainer mptIn in").addClass("right-content-inner"), $.event.trigger({
                                            type: "pageload",
                                            message: "The page has been fully loaded"
                                        }), $.debug && console.log("[AjaxNAV] Page loaded"), AppAjaxNavigation.hidePreloader()
                                    })
                                }, 600);
                                n.addClass("mptOut").onCSSAnimationEnd(function() {
                                    $(this).removeClass("mptOut"), $(this).remove(), e = null, n = null
                                })
                            }, 0)
                        } else n.animate({
                            opacity: "0"
                        }, $.ajaxNavFadeDuration, function() {
                            n.html(o), $("#right-content-wrapper").scrollTop(0), AppAjaxNavigation.pageLoadedActions(pageLoadScripts, pageLoadCSS, pageRequiredComponents, pageRequiredFeatures), AppLanguage.doLocale(), n.animate({
                                opacity: "1"
                            }, $.ajaxNavFadeDuration, function() {
                                $.event.trigger({
                                    type: "pageload",
                                    message: "The page has been fully loaded"
                                }), $.debug && console.log("[AjaxNAV] Page loaded");
                                setTimeout(function() {
                                    AppAjaxNavigation.hidePreloader()
                                }, 0)
                            }), e = null, n = null
                        })
                    },
                    error: function() {
                        $.debug && console.log("[AjaxNAV] Error loading the page"), AppAjaxNavigation.hidePreloader()
                    }
                })*/
            },
            pageLoadedActions: function(e, n, o, a) {
                $.debug && console.log("[pageLoadedActions] Init"), $LAB.setOptions({
                    AlwaysPreserveOrder: !0,
                    UseLocalXHR: !1
                }).wait(function() {
                    if ("array" == typeOf(pageLoadScripts) && pageLoadScripts.length > 0) try {
                        AppLoadScript.loadJS(pageLoadScripts), $.debug && console.log("[pageLoadedActions] Loading: pageLoadScript")
                    } catch (e) {
                        pageLoadScripts = void 0, $.debug && console.error("[pageLoadedActions] Error Executing: AppLoadScript.loadJS()")
                    }
                }).wait(function() {
                    if ("array" == typeOf(pageLoadCSS) && pageLoadCSS.length > 0) try {
                        AppLoadScript.loadCSS(pageLoadCSS), $.debug && console.log("[pageLoadedActions] Loading: pageLoadCSS")
                    } catch (e) {
                        pageLoadCSS = void 0, $.debug && console.error("[pageLoadedActions] Error Executing: AppLoadScript.loadCSS()")
                    }
                }).wait(function() {
                    if ("array" == typeOf(pageRequiredComponents) && pageRequiredComponents.length > 0) try {
                        AppComponents.reload(pageRequiredComponents), $.debug && console.log("[pageLoadedActions] Loading: pageRequiredComponents: " + pageRequiredComponents)
                    } catch (e) {
                        pageRequiredComponents = void 0, $.debug && console.error("[pageLoadedActions] Error Executing: AppComponents.reload()")
                    }
                }).wait(function() {
                    if ("array" == typeOf(pageRequiredFeatures) && pageRequiredFeatures.length > 0) try {
                        AppLoadScript.loadFeature(pageRequiredFeatures), $.debug && console.log("[pageLoadedActions] Loading: pageRequiredFeatures")
                    } catch (e) {
                        pageRequiredFeatures = void 0, $.debug && console.error("[pageLoadedActions] Error Executing: AppLoadScript.loadFeature()")
                    }
                }).wait(function() {
                    if (typeOf(doneScriptsLoad)) try {
                        doneScriptsLoad(), $.debug && console.log("[pageLoadedActions] Executing: doneScriptsLoad()")
                    } catch (e) {
                        doneScriptsLoad = void 0, $.debug && console.error("[pageLoadedActions] Error Executing: doneScriptsLoad()")
                    }
                }).wait(function() {
                    pageLoadScripts = void 0, pageLoadCSS = void 0, pageRequiredComponents = void 0, pageRequiredFeatures = void 0, doneScriptsLoad = void 0, $.debug && console.log("[pageLoadedActions] Finished")
                })
            },
            setBreadCrumb: function() {
                console.log("Seting breadcrumb.")
            },
            showPreloader: function() {
                if ("undefined" == typeOf($.preloaderActive) || !$.preloaderActive) {
                    $.preloaderActive = !0;
                    var e = '<div id="ajax-preloader"><div id="ajax-preloader-progressbar" aria-busy="true" aria-label="Loading" role="progressbar"></div></div>',
                        n = '<div id="circular-loader" md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style="width: 50px; height: 50px;"><path fill="none" transform="" d="" style="stroke-width: 5px;"></path></svg></div>';
                    $.ajaxNavCircularLoader = $(n);
                    var o = function() {
                        $("#right-content-wrapper .right-content-outter").prepend($.ajaxNavCircularLoader);
                        setTimeout(function() {
                            $.ajaxNavCircularLoader.addAnimatedClass("in")
                        }, 0)
                    };
                    if ("function" == typeof progressLink ? (progressLink($.ajaxNavCircularLoader), o()) : $document.on("scriptload", function() {
                            progressLink($.ajaxNavCircularLoader), o()
                        }), !$("#ajax-preloader", $body).exists()) {
                        $body.prepend(e);
                        setTimeout(function() {
                            $("#ajax-preloader").addAnimatedClass("progressIn")
                        }, 0)
                    }
                    $body.addClass("ajax-loading").attr("aria-busy", "true")
                }
            },
            hidePreloader: function() {
                if ($.preloaderActive) {
                    $.preloaderActive = !1;
                    var e = (setTimeout(function() {
                        $.ajaxNavCircularLoader.addAnimatedClass("out", function() {
                            progressLink.destroy(), $.ajaxNavCircularLoader.remove()
                        })
                    }, 0), $("#ajax-preloader"));
                    setTimeout(function() {
                        e.removeAnimatedClass("progressIn", function() {
                            e.remove()
                        })
                    }, 0);
                    $body.removeClass("ajax-loading").attr("aria-busy", "false")
                }
            },
            hideSplashScreen: function() {
                $("#splash-screen").fadeOut(800, function() {
                    $body.addClass("system-loaded"), $.event.trigger({
                        type: "systemload",
                        message: "The system has been fully loaded"
                    }), $(this).remove(), AppAjaxNavigation.hidePreloader(), $.debug && console.log("[App] System Fully Loaded")
                })
            }
        },
        AppHeader = {
            init: function() {
                AppFullScreen.init()
            }
        },
        AppFullScreen = {
            init: function() {
                var e = 0,
                    n = $("#fullscreen-toggle"),
                    o = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
                n.on("click", function() {
                    o ? $.debug && AppFullScreen.toggle() : $.debug && console.log("[FullScreen] Fullscreen Mode Disabled")
                }), $document.on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function() {
                    var o = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
                    o ? (e = 1, n.html('<i class="material-icons">fullscreen_exit</i>')) : (e = 0, n.html('<i class="material-icons">fullscreen</i>'))
                })
            },
            toggle: function() {
                document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.msRequestFullscreen ? document.documentElement.msRequestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            },
            state: function() {
                return fullScreenState
            }
        },
        AppSidebar = {
            init: function() {
                $.sidebarToggle.on("click", function() {
                    AppSidebar.toggle()
                }), AppSidebar.open(), AppSidebar.userbox(), AppSidebar.backdrop();
                var e = $("#sidebar"),
                    n = e.find("li").has("ul").children("ul");
                e.find("li").has("ul").children("a").append("<span class='menu-item-submenu-arrow'><i class='fa fa-angle-right'></i></span>"), $("li:last-child", n).addClass("lastChild").has("ul").addClass("hasMenu"), e.find("li").not(".open").has("ul").children("ul").wrapInner("<div class='submenu-inner-wrapper'>"), e.find("li").has("ul").children("a").on("click", function(e) {
                    e.preventDefault(), AppSidebar.submenuToggle($(this))
                })
            },
            open: function() {
                $.sidebarToggle.data("state", "open").removeClass("SidebarClose").addClass("SidebarOpen"), $body.removeClass("sidebar-close").addClass("sidebar-open"), $.sidebar.data("state", "open").addClass("SidebarOpen").removeClass("SidebarClose"), $.mainContent.addClass("SidebarOpen").removeClass("SidebarClose")
            },
            close: function() {
                $.sidebarToggle.data("state", "close").removeClass("SidebarOpen").addClass("SidebarClose"), $body.removeClass("sidebar-open").addClass("sidebar-close"), $.sidebar.data("state", "closed").removeClass("SidebarOpen").addClass("SidebarClose"), $.mainContent.removeClass("SidebarOpen").addClass("SidebarClose")
            },
            toggle: function() {
                var e = $.sidebar.data("state");
                "closed" == e ? AppSidebar.open() : "open" == e && AppSidebar.close()
            },
            update: function() {},
            autoCollapse: function(e) {
                "boolean" == typeOf($.sidebarMenuAutoCollapse) && (1 == e ? $.sidebarMenuAutoCollapse = !0 : 0 == e && ($.sidebarMenuAutoCollapse = !1))
            },
            submenuToggle: function(e) {
                var n = $(e).parent("li"),
                    o = n.offsetParent("ul"),
                    a = function(e, n) {
                        var o;
                        return o = $(e).children(".submenu-inner-wrapper").exists() ? e.children(".submenu-inner-wrapper").children("li").has("ul") : e.children("li").has("ul"), "index" == n ? o.length : "obj" == n ? o : void 0
                    };
                if ($.sidebarMenuAutoCollapse && a(o, "index") > 1) {
                    var t = a(o, "obj");
                    $.each(t, function() {
                        var n = $(this).children("a");
                        $(this) == e && console.log("el mismo"), "open" == $(this).data("state") && AppSidebar.submenu("close", n)
                    })
                }
                AppSidebar.submenu("toggle", e)
            },
            submenu: function(e, n) {
                var o = n.parent("li"),
                    a = o.children("ul"),
                    t = a.children(".submenu-inner-wrapper"),
                    i = t.outerHeight(!0);
                if (0 == i) {
                    var r = t.clone(),
                        s = {
                            display: "block",
                            border: "1px solid red",
                            position: "absolute",
                            top: "0px",
                            left: "0px"
                        },
                        i = r.css(s).insertAfter(o.children("ul")).outerHeight(!0);
                    r.remove()
                }
                a.css({
                    display: "block"
                });
                var i = i,
                    d = o.data("state"),
                    l = {
                        "margin-top": "-" + i + "px"
                    },
                    p = function(e, n) {
                        var o = n;
                        e.hasClass("lastChild") && (o += " lastChild"), e.hasClass("hasMenu") && (o += " hasMenu"), e.removeClass().addClass(o).data("state", n)
                    },
                    c = function() {
                        var e = {
                            "margin-top": "0px"
                        };
                        p(o, "opening"), t.css(l);
                        setTimeout(function() {
                            t.css(e).onCSSTransitionEnd(function() {
                                "opening" == o.data("state") && p(o, "open")
                            })
                        }, 10)
                    },
                    u = function() {
                        p(o, "closing");
                        setTimeout(function() {
                            t.css(l).onCSSTransitionEnd(function() {
                                "closing" == o.data("state") && (p(o, "closed"), o.children("ul").css({
                                    display: "none"
                                }))
                            })
                        }, 10)
                    };
                "toggle" == e ? "open" == d ? u() : ("undefined" === typeOf(d) || "closed" == d) && c() : "open" == e ? c() : "close" == e && u()
            },
            userbox: function() {
                var e = '<div class="userbox-bg-overlay"></div>';
                $("#userbox", $.sidebar).append(e)
            },
            backdrop: function() {
                $window.on("bemat-screen-resize", function(e) {
                    if (e.index <= 2) {
                        var n = $("#sidebar-backdrop");
                        n.length ? $body.addClass("backdrop-active") : $('<div id="sidebar-backdrop"></div>').insertBefore("#page-wrapper")
                    } else {
                        var n = $("#sidebar-backdrop");
                        n.length && (n.fadeOut(), $body.removeClass("backdrop-active"))
                    }
                }), $body.on("click", "#sidebar-backdrop", function() {
                    $body.removeClass("sidebar-open").addClass("sidebar-close"), AppSidebar.close()
                })
            }
        },
        AppLoadScript = {
            loadJS: function(e) {
                $LAB.setOptions({
                    AlwaysPreserveOrder: !0,
                    UseLocalXHR: !1
                }).script(e).wait(function() {
                    $.debug && console.log("[AppLoadScript] loadJS: Scripts loaded")
                })
            },
            loadCSS: function(e, n, o) {
                "undefined" == typeof o && (o = !1), $.when.apply($, $.map(e, function(e) {
                    return o && (e += "?_ts=" + (new Date).getTime()), $.get(e, function() {
                        $("<link>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: e
                        }).appendTo("head")
                    })
                })).then(function() {
                    "function" == typeof n && n(), $.debug && console.log("[AppLoadScript] loadCSS: Styles sheets loaded")
                })
            },
            loadFeature: function(features) {
                var i = 0,
                    c = [];
                for (i = 0; i < features.length; i++) $.appFeatures.some(function(obj) {
                    if (obj.name === features[i]) {
                        $.debug && console.log("[AppLoadFeature] Re-loading Feature: " + obj.name);
                        var cf = obj.feature + "()";
                        eval(cf)
                    }
                })
            }
        },
        AppOnLoad = {
            init: function() {
                $window.load(function() {
                    AppFeatures.windowResize();
                    setTimeout(function() {
                        AppAjaxNavigation.checkURL();
                        setTimeout(function() {
                            AppAjaxNavigation.hideSplashScreen()
                        }, 500)
                    }, 2e3);
                    AppLanguage.init()
                })
            }
        },
        AppTheme = {
            init: function() {},
            switchTheme: function() {},
            darkHeader: function() {
                $body.addClass("dark-header")
            },
            darkHeaderBrand: function() {
                $body.addClass("dark-header-brand")
            },
            darkHeaderToolbar: function() {
                $body.addClass("dark-header-toolbar")
            },
            darkSidebar: function() {
                $body.addClass("dark-sidebar")
            },
            lightHeader: function() {
                $body.removeClass("dark-header dark-header-brand dark-header-toolbar")
            },
            lightHeaderBrand: function() {
                $body.removeClass("dark-header-brand")
            },
            lightHeaderToolbar: function() {
                $body.removeClass("dark-header-toolbar")
            },
            lightSidebar: function() {
                $body.removeClass("dark-sidebar")
            },
            collapsedSidebar: function() {
                $body.addClass("sidebar-collapsed")
            },
            normalSidebar: function() {
                $body.removeClass("sidebar-collapsed")
            },
            headerNormal: function() {
                $(".page-header").exists() && $(".page-header").removeClass("alternative-header")
            },
            headerAlternative: function() {
                $(".page-header").exists() && $(".page-header").addClass("alternative-header")
            },
            footerNormal: function() {
                $body.hasClass("fixed-footer") && $body.removeClass("fixed-footer")
            },
            footerFixed: function() {
                $body.addClass("fixed-footer")
            },
            layoutNormal: function() {
                $body.hasClass("container") && $body.removeClass("container").addClass("container-fluid")
            },
            layoutBoxed: function() {
                $body.hasClass("container-fluid") && $body.removeClass("container-fluid").addClass("container")
            }
        },
        AppComponents = {
            init: function() {
                $.debug && console.log("[AppComponents] Init"), ComponentScrollbar.init(), ComponentPanel.init(), ComponentCheckbox.init(), ComponentSelect.init(), ComponentDropdown.init(), ComponentTooltip.init(), ComponentModals.init(), ComponentFloatingLabels.init(), ComponentScrollbar.init(), ComponentMaterialRipple.init(), ComponentSnackbar.init(), ComponentToast.init(), ComponentSubheader.init(), ComponentSimplePieCharts.init(), ComponentLinearProgress.init(), ComponentCircularProgress.init(), ComponentSpeedDial.init(), ComponentCKEditor.init()
            },
            reload: function(components) {
                $.debug && console.log("[AppComponents] Reload Init");
                var i = 0,
                    c = [];
                for (i = 0; i < components.length; i++) $.appComponents.some(function(obj) {
                    if (obj.name === components[i]) {
                        $.debug && console.log("[AppComponents] RE-Loading Component: " + obj.component);
                        var cf = obj.component + ".init()";
                        eval(cf)
                    }
                })
            }
        },
        ComponentPanel = {
            init: function() {
                $.debug && console.log("[AppComponents] > Panel Init");
                $(".panel-footer").prev(".panel-body").addClass("panel-body-footer");
                $(".panel-group .panel .in").each(function() {
                    var e = $(this).parent();
                    e.addClass("open")
                }), $(".panel-group").on("hide.bs.collapse", function(e) {
                    var n = $(e.target),
                        o = n.parent();
                    o.removeClass("open")
                }), $(".panel-group").on("show.bs.collapse", function(e) {
                    var n = $(e.target),
                        o = n.parent(),
                        a = o.closest(".panel-group");
                    a.find(".panel.expanded").removeClass("open"), o.addClass("open")
                }), $("#right-content").on("click", ".panel-tools-collapse", function(e) {
                    e.preventDefault();
                    var n = $(this),
                        o = n.closest(".panel");
                    "panel-collapsed" == o.data("state") ? ($(".panel-body", o).slideDown("slow", function() {
                        n.removeClass("collapsed")
                    }), o.data("state", "panel-open").addClass("panel-open").removeClass("panel-collapsed")) : ($(".panel-body", o).slideUp("slow", function() {
                        n.addClass("collapsed")
                    }), o.data("state", "panel-collapsed").addClass("panel-collapsed").removeClass("panel-open"))
                }), $("#right-content").on("click", ".panel-tools-close", function(e) {
                    e.preventDefault();
                    var n = $(this),
                        o = n.closest(".panel");
                    o.fadeOut("slow")
                })
            }
        },
        ComponentCheckbox = {
            init: function() {
                $.debug && console.log("[AppComponents] > Checkbox Init"), $("body input[type=checkbox].switch,body input[type=radio].switch").exists() && $("body input[type=checkbox].switch,body input[type=radio].switch").iCheck({
                    checkboxClass: "custom-switch",
                    radioClass: "custom-switch",
                    inheritClass: !0
                }), $("body input[type=checkbox].checkbox").exists() && $("body input[type=checkbox].checkbox").iCheck({
                    checkboxClass: "custom-check",
                    inheritClass: !0
                }), $("body input[type=radio].radio").exists() && $("body input[type=radio].radio").iCheck({
                    radioClass: "custom-radio",
                    inheritClass: !0
                })
            }
        },
        ComponentSelect = {
            init: function() {
                $.debug && console.log("[AppComponents] > Selectbox Init"), $("select").exists() && $("select").selectpicker({
                    dropupAuto: !1,
                    size: 5
                }), $(".bootstrap-select").on({
                    "show.bs.dropdown": function() {
                        var e = $(this),
                            n = e.siblings(".bs-select-hidden"),
                            o = $(".btn.dropdown-toggle", e),
                            a = $(".dropdown-menu", e),
                            t = $(".inner", a),
                            i = $(".selected", a).data("original-index"),
                            r = i + 1,
                            s = $("li", a).length,
                            d = n.outerHeight(),
                            l = 48,
                            p = 8,
                            c = 0,
                            u = 0,
                            m = 0,
                            g = 1 * l / d;
                        if (o.hasClass("btn-default") && o.removeClass("btn-default"), r > 3) {
                            var f = s - r;
                            f >= 2 ? (m = 2, u = s - (f + 3)) : 1 == f ? (m = 3, u = s - 2) : 0 == f && (m = s >= 5 ? 4 : 3, u = s - 3), c = m * d * g + p, t.scrollTop(l * u);
                            var b = {
                                top: "-" + c + "px"
                            };
                            a.css(b)
                        } else c = d * i * g + p, b = {
                            top: "-" + c + "px"
                        }, a.css(b), t.scrollTop(0);
                        setTimeout(function() {
                            n.focus()
                        }, 0)
                    },
                    "hide.bs.dropdown": function(e) {
                        var n = $(this),
                            o = n.siblings(".bs-select-hidden");
                        $(".dropdown-menu", n), setTimeout(function() {
                            o.focus()
                        }, 0)
                    }
                })
            }
        },
        ComponentDropdown = {
            init: function() {
                $.debug && console.log("[AppComponents] > Dropdown Init"), $(".dropdown,.dropup,.btn-group,.input-group-btn").on({
                    "show.bs.dropdown": function() {
                        var e = $(this),
                            n = $('[data-toggle="dropdown"]', e),
                            o = $(".dropdown-menu", e),
                            a = o.outerWidth(!0),
                            t = n.outerWidth(!0),
                            i = {
                                "min-width": t + "px"
                            };
                        t > a && o.css(i);
                        var r = $("li", o),
                            s = r.length,
                            d = 0;
                        $.each(r, function() {
                            var e = s - d,
                                n = "animation-delay-pos" + e;
                            $(this).addClass(n), d += 1
                        })
                    },
                    "shown.bs.dropdown": function() {},
                    click: function() {
                        this.closable = !0
                    },
                    "hide.bs.dropdown": function(e) {
                        var n = $(this);
                        return this.closable ? (e.preventDefault(), n.addClass("closing"), $(".dropdown-menu", n).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
                            n.removeClass("open closing")
                        }), void 0) : !1
                    }
                })
            }
        },
        ComponentTooltip = {
            init: function() {
                $.debug && console.log("[AppComponents] > Tooltip Init"), $("#language-selector").exists() && $("#language-selector").tooltip(), $('[data-toggle="tooltip"]').exists() && $('[data-toggle="tooltip"]').tooltip({
                    template: '<div class="tooltip" role="tooltip"><div class="tooltip-wrapper"><div class="tooltip-background"></div><div class="tooltip-inner"></div></div></div>'
                }), $('[data-toggle="tooltip"]').on({
                    "shown.bs.tooltip": function() {
                        var e = $(this),
                            n = e.data("bs.tooltip").tip(),
                            o = n.height() / 2,
                            a = n.width() / 2,
                            t = Math.sqrt(o * o + a * a),
                            i = 2 * t,
                            r = {
                                top: "50% bottom 0px",
                                bottom: "50% top 0px",
                                left: "right 50% 0px",
                                right: "left 50% 0px"
                            },
                            s = r[e.data("placement")],
                            d = {
                                width: i + "px",
                                height: i + "px",
                                top: "50%",
                                left: "50%",
                                "margin-top": "-" + i / 2 + "px",
                                "margin-left": "-" + i / 2 + "px",
                                "transform-origin": s + " !important"
                            };
                        $(".tooltip-background", n).css(d);
                        setTimeout(function() {
                            $(".tooltip-background", n).addClass("tooltip-show")
                        }, 100)
                    },
                    "hide.bs.tooltip": function() {
                        var e = $(this),
                            n = e.data("bs.tooltip").tip();
                        $(".tooltip-background", n).removeClass("tooltip-show")
                    }
                })
            }
        },
        ComponentModals = {
            init: function() {
                $.debug && console.log("[AppComponents] > Modals Init"), $(".modal").on({
                    "show.bs.modal": function(e) {
                        var n = ($(this), $(e.relatedTarget)),
                            o = n.outerWidth(),
                            a = (n.outerHeight(), $(".modal-dialog", e.target)),
                            t = a.outerWidth(),
                            i = (a.outerHeight(), o / t),
                            r = n.offset();
                        a.data("scale", i).data("top", r.top).data("left", r.left);
                        var s = {
                            transform: "scale(" + i + ")",
                            opacity: 0,
                            top: r.top,
                            left: r.left
                        };
                        a.css(s);
                        setTimeout(function() {
                            var e = {
                                transform: "scale(1) translate(-50%,-50%)",
                                opacity: 1,
                                top: "50%",
                                left: "50%"
                            };
                            a.css(e)
                        }, 550)
                    },
                    "shown.bs.modal": function(e) {
                        $(".modal-dialog", e.target)
                    },
                    "hide.bs.modal": function(e) {
                        var n = $(".modal-dialog", e.target),
                            o = n.data("scale"),
                            a = n.data("top"),
                            t = n.data("left"),
                            i = {
                                transform: "scale(" + o + ")",
                                opacity: 0,
                                top: a,
                                left: t
                            };
                        n.css(i)
                    }
                })
            }
        },
        ComponentFloatingLabels = {
            init: function() {
                $.debug && console.log("[AppComponents] > FloatingLabels Init"), $(".floating-label .form-control").on("keyup change", function(e) {
                    var n = $(e.currentTarget);
                    "" !== $.trim(n.val()) ? n.addClass("filled").removeClass("static") : n.removeClass("filled").removeClass("static")
                }), $(".form-control").exists() && ($(".floating-label .form-control").each(function() {
                    var e = $(this);
                    "" !== $.trim(e.val()) && e.addClass("static").addClass("filled")
                }), $(".form-horizontal .form-control").each(function() {
                    $(this).after('<div class="form-control-line"></div>')
                }))
            }
        },
        ComponentScrollbar = {
            init: function() {
                $.debug && console.log("[AppComponents] > Scrollbar Init"), $("#sidebar-wrapper,#right-content-wrapper, .side-panel-body, .panel-body").perfectScrollbar(), $(".has-custom-scrollbar").perfectScrollbar()
            }
        },
        ComponentMaterialRipple = {
            init: function() {
                $.debug && console.log("[AppComponents] > MaterialRipple Init"), $(".btn").exists() && $(".btn").materialRipple({
                    style: "light"
                }), $("#sidebar").exists() && $("#sidebar").find("a").materialRipple({
                    style: "dark"
                }), $(".dropdown-menu li").exists() && $(".dropdown-menu li").materialRipple({
                    style: "dark"
                })
            }
        },
        ComponentSnackbar = {
            init: function() {
                $.debug && console.log("[AppComponents] > Snackbar Init"), $.snackbar()
            }
        },
        ComponentToast = {
            init: function() {
                $.debug && console.log("[AppComponents] > Toast Init"), $.toasts({
                    oneAtTime: !1,
                    padding: "76px 16px 16px 16px"
                })
            }
        },
        ComponentSubheader = {
            init: function() {
                $.debug && console.log("[AppComponents] > Subheader Init"), $("[data-toggle='subheader']").subheader()
            }
        },
        ComponentSimplePieCharts = {
            init: function() {
                $.debug && console.log("[AppComponents] > SimplePieCharts Init"), $("[data-toggle='simple-pie-chart']").simplePieChart({
                    size: 130,
                    duration: 1e3
                })
            }
        },
        ComponentLinearProgress = {
            init: function() {
                $.debug && console.log("[AppComponents] > LinearProgress Init"), $("[data-toggle='linear-progress']").linearProgress()
            }
        },
        ComponentCircularProgress = {
            init: function() {
                $.debug && console.log("[AppComponents] > CircularProgress Init"), $("[data-toggle='circular-progress']").circularProgress()
            }
        },
        ComponentSpeedDial = {
            init: function() {
                $.debug && console.log("[AppComponents] > SpeedDial Init"), $("[data-toggle='speed-dial']").speedDial()
            }
        },
        ComponentCKEditor = {
            init: function() {
                $.debug && console.log("[AppComponents] > CKEditor Init"), CKEDITOR.skinName = $.ckeditorSkin
            }
        };
    cc.loadScript = {
        load: function(e) {
            AppLoadScript.loadJS(e)
        }
    }, cc.system = {
        setUpComponents: function() {
            AppComponents.init()
        },
        pageTransitionNormal: function() {},
        materialPageTransition: function() {
            AppAjaxNavigation.materialPageTransition(1)
        },
        normalPageTransition: function() {
            AppAjaxNavigation.materialPageTransition(0)
        },
        sidebarSubmenuAccordion: function() {
            AppSidebar.autoCollapse(1)
        },
        sidebarSubmenuNormal: function() {
            AppSidebar.autoCollapse(0)
        }
    }, cc.navigate = {
        go: function(e) {
            console.log("[AppNavigate] Going to: " + e), AppAjaxNavigation.loadURL(e, $.ajaxContainer)
        }
    }, cc.sidebar = {
        toggle: function() {
            AppSidebar.toggle()
        }
    }, cc.theme = {
        darkHeaderFull: function() {
            AppTheme.darkHeaderFull()
        },
        darkHeaderBrand: function() {
            AppTheme.darkHeaderBrand()
        },
        darkHeaderToolbar: function() {
            AppTheme.darkHeaderToolbar()
        },
        darkSidebar: function() {
            AppTheme.darkSidebar()
        },
        lightHeaderFull: function() {
            AppTheme.lightHeaderFull()
        },
        lightHeaderBrand: function() {
            AppTheme.lightHeaderBrand()
        },
        lightHeaderToolbar: function() {
            AppTheme.lightHeaderToolbar()
        },
        lightSidebar: function() {
            AppTheme.lightSidebar()
        },
        sidebarCollapsed: function() {
            AppTheme.collapsedSidebar()
        },
        sidebarNormal: function() {
            AppTheme.normalSidebar()
        },
        pageHeaderNormal: function() {
            AppTheme.headerNormal()
        },
        pageHeaderAlternative: function() {
            AppTheme.headerAlternative()
        },
        footerNormal: function() {
            AppTheme.footerNormal()
        },
        footerFixed: function() {
            AppTheme.footerFixed()
        },
        layoutNormal: function() {
            AppTheme.layoutNormal()
        },
        layoutBoxed: function() {
            AppTheme.layoutBoxed()
        }
    }, window.bematadmin = window.bematadmin || {}, window.bematadmin.App = new App
}(jQuery)), jQuery.fn.extend({
    toggleText: function(e, n) {
        var o = !1,
            a = this;
        return this.click(function() {
            o ? (a.text(e), o = !1) : (a.text(n), o = !0)
        }), this
    }
}), jQuery.fn.exists = function() {
    return this.length > 0
}, $.fn.extend({
    animateCss: function(e, n) {
        var o = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
        $(this).addClass("animated " + e).one(o, function() {
            $(this).removeClass("animated " + e), n && n()
        })
    },
    addAnimatedClass: function(e, n) {
        var o = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
            a = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
        $(this).addClass(e).one(o + " " + a, function() {
            n && n()
        })
    },
    removeAnimatedClass: function(e, n) {
        var o = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
        $(this).removeClass(e).one(o, function() {
            n && n()
        })
    }
});
var s = document.body || document.documentElement,
    s = s.style,
    prefixAnimation = "",
    prefixTransition = "";
"" == s.WebkitAnimation && (prefixAnimation = "-webkit-"), "" == s.MozAnimation && (prefixAnimation = "-moz-"), "" == s.OAnimation && (prefixAnimation = "-o-"), "" == s.WebkitTransition && (prefixTransition = "-webkit-"), "" == s.MozTransition && (prefixTransition = "-moz-"), "" == s.OTransition && (prefixTransition = "-o-"), $.fn.extend({
    onCSSAnimationEnd: function(e) {
        var n = $(this).eq(0);
        return n.one("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend", e), ("" != prefixAnimation || "animation" in s) && "0s" != n.css(prefixAnimation + "animation-duration") || e(), this
    },
    onCSSTransitionEnd: function(e) {
        var n = $(this).eq(0);
        return n.one("webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend", e), ("" != prefixTransition || "transition" in s) && "0s" != n.css(prefixTransition + "transition-duration") || e(), this
    }
});
