(function () {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  (self["webpackChunkrocket"] = self["webpackChunkrocket"] || []).push([["main"], {
    /***/
    8255: function _(module) {
      function webpackEmptyAsyncContext(req) {
        // Here Promise.resolve().then() is used instead of new Promise() to prevent
        // uncaught exception popping up in devtools
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      webpackEmptyAsyncContext.keys = function () {
        return [];
      };

      webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
      webpackEmptyAsyncContext.id = 8255;
      module.exports = webpackEmptyAsyncContext;
      /***/
    },

    /***/
    158: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "AppRoutingModule": function AppRoutingModule() {
          return (
            /* binding */
            _AppRoutingModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/router */
      9895);
      /* harmony import */


      var _views_settings_globals_globals_settings_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./views/settings/globals/globals-settings.component */
      1218);
      /* harmony import */


      var _views_settings_settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./views/settings/settings.component */
      4988);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var routes = [{
        path: 'settings',
        component: _views_settings_settings_component__WEBPACK_IMPORTED_MODULE_1__.SettingsComponent,
        children: [{
          path: 'globals',
          component: _views_settings_globals_globals_settings_component__WEBPACK_IMPORTED_MODULE_0__.GlobalsSettingsComponent
        }]
      }];

      var _AppRoutingModule = function _AppRoutingModule() {
        _classCallCheck(this, _AppRoutingModule);
      };

      _AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) {
        return new (t || _AppRoutingModule)();
      };

      _AppRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
        type: _AppRoutingModule
      });
      _AppRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
        imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forRoot(routes)]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](_AppRoutingModule, {
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
        });
      })();
      /***/

    },

    /***/
    5041: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "AppComponent": function AppComponent() {
          return (
            /* binding */
            _AppComponent
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      7716);
      /* harmony import */


      var _views_views_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./views/views.component */
      6963);

      var _AppComponent = function _AppComponent() {
        _classCallCheck(this, _AppComponent);
      };

      _AppComponent.ɵfac = function AppComponent_Factory(t) {
        return new (t || _AppComponent)();
      };

      _AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
        type: _AppComponent,
        selectors: [["app-root"]],
        decls: 3,
        vars: 0,
        consts: [[1, "grid"], [1, "col"]],
        template: function AppComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "app-views");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          }
        },
        directives: [_views_views_component__WEBPACK_IMPORTED_MODULE_0__.ViewsComponent],
        encapsulation: 2
      });
      /***/
    },

    /***/
    6747: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "AppModule": function AppModule() {
          return (
            /* binding */
            _AppModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/platform-browser */
      9075);
      /* harmony import */


      var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/platform-browser/animations */
      5835);
      /* harmony import */


      var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./app-routing.module */
      158);
      /* harmony import */


      var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./app.component */
      5041);
      /* harmony import */


      var _services_services_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./services/services.module */
      8812);
      /* harmony import */


      var _views_views_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./views/views.module */
      5397);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _AppModule = function _AppModule() {
        _classCallCheck(this, _AppModule);
      };

      _AppModule.ɵfac = function AppModule_Factory(t) {
        return new (t || _AppModule)();
      };

      _AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({
        type: _AppModule,
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
      });
      _AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({
        imports: [[// Angular
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__.BrowserAnimationsModule, // Routing
        _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, // Custom
        _views_views_module__WEBPACK_IMPORTED_MODULE_3__.ViewsModule, _services_services_module__WEBPACK_IMPORTED_MODULE_2__.ServicesModule]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](_AppModule, {
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent],
          imports: [// Angular
          _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__.BrowserAnimationsModule, // Routing
          _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, // Custom
          _views_views_module__WEBPACK_IMPORTED_MODULE_3__.ViewsModule, _services_services_module__WEBPACK_IMPORTED_MODULE_2__.ServicesModule]
        });
      })();
      /***/

    },

    /***/
    5717: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "GlobalsServiceModule": function GlobalsServiceModule() {
          return (
            /* binding */
            _GlobalsServiceModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _globals_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./globals.service */
      5954);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _GlobalsServiceModule = function _GlobalsServiceModule() {
        _classCallCheck(this, _GlobalsServiceModule);
      };

      _GlobalsServiceModule.ɵfac = function GlobalsServiceModule_Factory(t) {
        return new (t || _GlobalsServiceModule)();
      };

      _GlobalsServiceModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
        type: _GlobalsServiceModule
      });
      _GlobalsServiceModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
        providers: [_globals_service__WEBPACK_IMPORTED_MODULE_0__.GlobalsService]
      });
      /***/
    },

    /***/
    5954: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "GlobalsService": function GlobalsService() {
          return (
            /* binding */
            _GlobalsService
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! rxjs */
      6215);
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! rxjs/operators */
      8345);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _GlobalsService = /*#__PURE__*/function () {
        function _GlobalsService() {
          _classCallCheck(this, _GlobalsService);

          this.subject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(this.load());
        }

        _createClass(_GlobalsService, [{
          key: "load",
          value: function load() {
            return {
              g: 9.81,
              p_amb: 101325
            };
          }
        }, {
          key: "get",
          value: function get() {
            return this.subject.value;
          }
        }, {
          key: "asObservable",
          value: function asObservable() {
            return this.subject.asObservable().pipe((0, rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.share)());
          }
        }, {
          key: "update",
          value: function update(globals) {
            this.subject.next(globals);
          }
        }]);

        return _GlobalsService;
      }();

      _GlobalsService.ɵfac = function GlobalsService_Factory(t) {
        return new (t || _GlobalsService)();
      };

      _GlobalsService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
        token: _GlobalsService,
        factory: _GlobalsService.ɵfac
      });
      /***/
    },

    /***/
    8812: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "ServicesModule": function ServicesModule() {
          return (
            /* binding */
            _ServicesModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./globals/globals-service.module */
      5717);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _ServicesModule = function _ServicesModule() {
        _classCallCheck(this, _ServicesModule);
      };

      _ServicesModule.ɵfac = function ServicesModule_Factory(t) {
        return new (t || _ServicesModule)();
      };

      _ServicesModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
        type: _ServicesModule
      });
      _ServicesModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
        imports: [[// custom
        _globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsServiceModule]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](_ServicesModule, {
          imports: [// custom
          _globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsServiceModule]
        });
      })();
      /***/

    },

    /***/
    65: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "FormUtils": function FormUtils() {
          return (
            /* binding */
            _FormUtils
          );
        }
        /* harmony export */

      });

      var _FormUtils = /*#__PURE__*/function () {
        function _FormUtils() {
          _classCallCheck(this, _FormUtils);
        }

        _createClass(_FormUtils, null, [{
          key: "getControl",
          value: function getControl(formGroup, name) {
            if (!formGroup) {
              return undefined;
            }

            var control = formGroup.get(name);

            if (!control) {
              return undefined;
            }

            return control;
          }
        }, {
          key: "getValueOrDefault",
          value: function getValueOrDefault(formGroup, name, defaultValue) {
            var control = _FormUtils.getControl(formGroup, name);

            if (!control) {
              return defaultValue;
            }

            if (control.value === undefined || control.value === null) {
              return defaultValue;
            }

            return control.value;
          }
        }]);

        return _FormUtils;
      }();
      /***/

    },

    /***/
    1218: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "GlobalsSettingsComponent": function GlobalsSettingsComponent() {
          return (
            /* binding */
            _GlobalsSettingsComponent
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/forms */
      3679);
      /* harmony import */


      var _utils_form_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ../../../utils/form-utils */
      65);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/core */
      7716);
      /* harmony import */


      var _services_globals_globals_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ../../../services/globals/globals.service */
      5954);
      /* harmony import */


      var primeng_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! primeng/card */
      7745);
      /* harmony import */


      var primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! primeng/inputtext */
      3928);

      var _GlobalsSettingsComponent = /*#__PURE__*/function () {
        function _GlobalsSettingsComponent(globalsService) {
          _classCallCheck(this, _GlobalsSettingsComponent);

          this.globalsService = globalsService;
          this.formGroup = this.create();
          this.subscriptions = [];
        }

        _createClass(_GlobalsSettingsComponent, [{
          key: "create",
          value: function create() {
            return new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroup({
              g: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl(),
              p_amb: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl()
            });
          }
        }, {
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this = this;

            var globalsSubscription = this.globalsService.asObservable().subscribe(function (globals) {
              _this.onGlobals(globals);
            });
            var formSubscription = this.formGroup.valueChanges.subscribe(function () {
              _this.onFormChanged();
            });
            this.subscriptions.push(formSubscription, globalsSubscription);
          }
        }, {
          key: "onGlobals",
          value: function onGlobals(globals) {
            this.formGroup.patchValue(globals, {
              emitEvent: false
            });
          }
        }, {
          key: "onFormChanged",
          value: function onFormChanged() {
            var g = _utils_form_utils__WEBPACK_IMPORTED_MODULE_0__.FormUtils.getValueOrDefault(this.formGroup, 'g', 9.81);

            var p_amb = _utils_form_utils__WEBPACK_IMPORTED_MODULE_0__.FormUtils.getValueOrDefault(this.formGroup, 'p_amb', 101325);

            this.globalsService.update({
              g: g,
              p_amb: p_amb
            });
          }
        }, {
          key: "ngOnDestroy",
          value: function ngOnDestroy() {
            this.subscriptions.forEach(function (subscription) {
              subscription.unsubscribe();
            });
          }
        }]);

        return _GlobalsSettingsComponent;
      }();

      _GlobalsSettingsComponent.ɵfac = function GlobalsSettingsComponent_Factory(t) {
        return new (t || _GlobalsSettingsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_globals_globals_service__WEBPACK_IMPORTED_MODULE_1__.GlobalsService));
      };

      _GlobalsSettingsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
        type: _GlobalsSettingsComponent,
        selectors: [["ng-component"]],
        decls: 19,
        vars: 1,
        consts: [["header", "Globals"], [1, "card"], [3, "formGroup"], [1, "field", "grid"], ["for", "g", 1, "col-12"], [1, "col-12"], [1, "p-inputgroup"], ["id", "g", "type", "number", "formControlName", "g", "pInputText", "", 1, "inputfield", "w-full"], [1, "p-inputgroup-addon"], ["for", "pamb", 1, "col-12"], ["id", "pamb", "type", "number", "formControlName", "p_amb", "pInputText", "", 1, "inputfield", "w-full"]],
        template: function GlobalsSettingsComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "p-card", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "form", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "label", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Gravity of Eart");

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "input", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "span", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "m/s");

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "label", 9);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "Atmosphere Pressure");

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "input", 10);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "span", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "pa");

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);

            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.formGroup);
          }
        },
        directives: [primeng_card__WEBPACK_IMPORTED_MODULE_4__.Card, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, primeng_inputtext__WEBPACK_IMPORTED_MODULE_5__.InputText],
        encapsulation: 2
      });
      /***/
    },

    /***/
    6699: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "GlobalsSettingsModule": function GlobalsSettingsModule() {
          return (
            /* binding */
            _GlobalsSettingsModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      3679);
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/platform-browser */
      9075);
      /* harmony import */


      var primeng_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! primeng/card */
      7745);
      /* harmony import */


      var primeng_inputtext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! primeng/inputtext */
      3928);
      /* harmony import */


      var _services_globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ../../../services/globals/globals-service.module */
      5717);
      /* harmony import */


      var _globals_settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./globals-settings.component */
      1218);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _GlobalsSettingsModule = function _GlobalsSettingsModule() {
        _classCallCheck(this, _GlobalsSettingsModule);
      };

      _GlobalsSettingsModule.ɵfac = function GlobalsSettingsModule_Factory(t) {
        return new (t || _GlobalsSettingsModule)();
      };

      _GlobalsSettingsModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
        type: _GlobalsSettingsModule
      });
      _GlobalsSettingsModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
        imports: [[// Angular
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, // Primeng
        primeng_card__WEBPACK_IMPORTED_MODULE_5__.CardModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_6__.InputTextModule, // Custom
        _services_globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsServiceModule]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](_GlobalsSettingsModule, {
          declarations: [_globals_settings_component__WEBPACK_IMPORTED_MODULE_1__.GlobalsSettingsComponent],
          imports: [// Angular
          _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, // Primeng
          primeng_card__WEBPACK_IMPORTED_MODULE_5__.CardModule, primeng_inputtext__WEBPACK_IMPORTED_MODULE_6__.InputTextModule, // Custom
          _services_globals_globals_service_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsServiceModule],
          exports: [_globals_settings_component__WEBPACK_IMPORTED_MODULE_1__.GlobalsSettingsComponent]
        });
      })();
      /***/

    },

    /***/
    4988: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "SettingsComponent": function SettingsComponent() {
          return (
            /* binding */
            _SettingsComponent
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      7716);
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/router */
      9895);

      var _SettingsComponent = function _SettingsComponent() {
        _classCallCheck(this, _SettingsComponent);
      };

      _SettingsComponent.ɵfac = function SettingsComponent_Factory(t) {
        return new (t || _SettingsComponent)();
      };

      _SettingsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: _SettingsComponent,
        selectors: [["ng-component"]],
        decls: 1,
        vars: 0,
        template: function SettingsComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
          }
        },
        directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
        encapsulation: 2
      });
      /***/
    },

    /***/
    5671: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "SettingsModule": function SettingsModule() {
          return (
            /* binding */
            _SettingsModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/platform-browser */
      9075);
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/router */
      9895);
      /* harmony import */


      var _globals_globals_settings_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./globals/globals-settings.module */
      6699);
      /* harmony import */


      var _settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./settings.component */
      4988);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _SettingsModule = function _SettingsModule() {
        _classCallCheck(this, _SettingsModule);
      };

      _SettingsModule.ɵfac = function SettingsModule_Factory(t) {
        return new (t || _SettingsModule)();
      };

      _SettingsModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
        type: _SettingsModule
      });
      _SettingsModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
        imports: [[// Angular
        _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, // Custom
        _globals_globals_settings_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsSettingsModule]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](_SettingsModule, {
          declarations: [_settings_component__WEBPACK_IMPORTED_MODULE_1__.SettingsComponent],
          imports: [// Angular
          _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, // Custom
          _globals_globals_settings_module__WEBPACK_IMPORTED_MODULE_0__.GlobalsSettingsModule],
          exports: [_settings_component__WEBPACK_IMPORTED_MODULE_1__.SettingsComponent]
        });
      })();
      /***/

    },

    /***/
    6963: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "ViewsComponent": function ViewsComponent() {
          return (
            /* binding */
            _ViewsComponent
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      7716);
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/router */
      9895);

      var _ViewsComponent = function _ViewsComponent() {
        _classCallCheck(this, _ViewsComponent);
      };

      _ViewsComponent.ɵfac = function ViewsComponent_Factory(t) {
        return new (t || _ViewsComponent)();
      };

      _ViewsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: _ViewsComponent,
        selectors: [["app-views"]],
        decls: 3,
        vars: 0,
        consts: [[1, "grid"], [1, "col"]],
        template: function ViewsComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "router-outlet");

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          }
        },
        directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
        encapsulation: 2
      });
      /***/
    },

    /***/
    5397: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "ViewsModule": function ViewsModule() {
          return (
            /* binding */
            _ViewsModule
          );
        }
        /* harmony export */

      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/platform-browser */
      9075);
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/router */
      9895);
      /* harmony import */


      var _settings_settings_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./settings/settings.module */
      5671);
      /* harmony import */


      var _views_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./views.component */
      6963);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);

      var _ViewsModule = function _ViewsModule() {
        _classCallCheck(this, _ViewsModule);
      };

      _ViewsModule.ɵfac = function ViewsModule_Factory(t) {
        return new (t || _ViewsModule)();
      };

      _ViewsModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
        type: _ViewsModule
      });
      _ViewsModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
        imports: [[// Angular
        _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, // Custom
        _settings_settings_module__WEBPACK_IMPORTED_MODULE_0__.SettingsModule]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](_ViewsModule, {
          declarations: [_views_component__WEBPACK_IMPORTED_MODULE_1__.ViewsComponent],
          imports: [// Angular
          _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, // Custom
          _settings_settings_module__WEBPACK_IMPORTED_MODULE_0__.SettingsModule],
          exports: [_views_component__WEBPACK_IMPORTED_MODULE_1__.ViewsComponent]
        });
      })();
      /***/

    },

    /***/
    2340: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export */


      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        "environment": function environment() {
          return (
            /* binding */
            _environment
          );
        }
        /* harmony export */

      });

      var _environment = {
        production: false
      };
      /***/
    },

    /***/
    4431: function _(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/platform-browser */
      9075);
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/core */
      7716);
      /* harmony import */


      var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./app/app.module */
      6747);
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./environments/environment */
      2340);

      if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
        (0, _angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
      }

      _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)["catch"](function (e) {
        console.error(e);
      });
      /***/

    }
  },
  /******/
  function (__webpack_require__) {
    // webpackRuntimeModules

    /******/
    "use strict";
    /******/

    /******/

    var __webpack_exec__ = function __webpack_exec__(moduleId) {
      return __webpack_require__(__webpack_require__.s = moduleId);
    };
    /******/


    __webpack_require__.O(0, ["vendor"], function () {
      return __webpack_exec__(4431);
    });
    /******/


    var __webpack_exports__ = __webpack_require__.O();
    /******/

  }]);
})();
//# sourceMappingURL=main-es5.js.map