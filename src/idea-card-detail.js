import {bindable} from "aurelia-framework";
import {computedFrom} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {Project} from './models/project';
import {Router} from 'aurelia-router';
import {ProjectService} from './services/project-service';
import {TooltipService} from './services/tooltip-service';
import {jQuery} from "jquery";
import {Finger} from "jquery.finger";
import {_} from 'lodash';

@inject(HttpClient, Router, ProjectService, TooltipService)
export class IdeaCardDetail {
    _titleEditEnabled = false;
    _overviewEditEnabled = false;
    _descrEditEnabled = false;
    _lastProjectTitle = null;
    _lastProjectOverview = null;
    _lastProjectDescription = null;

    project = {
        description: ''  // Markdown component doesn't like null values!
    };

    constructor(http, router, projectService, tooltipService) {
        http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('/');
        });

        this.http = http;
        this.router = router;
        this.projectService = projectService;
        this.tooltipService = tooltipService;
    }

    activate(params) {
        this.projectService.getProjects()
            .then(projects => {
                this.project = _.find(projects, { _id: params.id })

                this._lastProjectTitle = this.project._title;
                this._lastProjectOverview = this.project._overview;
                this._lastProjectDescription = this.project._description;
            });
    }

    attached() {
        var myRouter = this.router;
        $("#card-detail").modal('show');
        $('#card-detail').on('hidden.bs.modal', function () {
            myRouter.navigateToRoute('overview');
        });
        this.tooltipService.DisplayForPage("IdeaCardDetail");
    }

    @computedFrom('_titleEditEnabled')
    get TitleEditEnabled() {
        return this._titleEditEnabled;
    }

    @computedFrom('_overviewEditEnabled')
    get OverviewEditEnabled() {
        return this._overviewEditEnabled;
    }

    @computedFrom('_descrEditEnabled')
    get DescrEditEnabled() {
        return this._descrEditEnabled;
    }

    get IsDescriptionEmpty() {
        return this._lastProjectDescription === null ||
            this._lastProjectDescription === "";
    }

    EnableTitleEdit(event) {
        var me = this;
        var selector = "h2.card-title"
        $(selector).on('doubletap', function () {
            me._titleEditEnabled = true;
            setTimeout(function () {
                $("input.card-title").select();
            }, 0);
        });
    }

    EnableOverviewEdit(event) {
        var me = this;
        var selector = "div.card-overview"
        $(selector).on('doubletap', function() {
            me._overviewEditEnabled = true;
            setTimeout(function () {
                $("textarea.card-overview").select();
            }, 0);
        });
        // $(selector).dblclick(function () {
            
        // });
    }

    EnableDescrEdit(event) {
        if (event.srcElement.nodeName.toLowerCase() == "a") {
            return true;
        }

        var me = this;
        var selector = "div.card-text"
        $(selector).on('doubletap', function() {
            me.DoEnableDescrEditMode();
        });
    }

    DoEnableDescrEditMode() {
        this._descrEditEnabled = true;

        var selector = `text-${this.project._id}`;
        setTimeout(function () {
            let element = document.getElementById(selector);
            element.style.height = "0px";
            element.style.height = (element.scrollHeight) + "px";
            element.focus();
            element.select();
        }, 0);
    }

    SaveTitle() {
        this.project.validation.validate()
            .then(() => {
                this.DoSaveTitle();
                this.projectService.editProjectTitle(this.project);
            }).catch(error => {
                console.error(error);
                if (error.properties._title.IsValid) {
                    this.DoSaveTitle();
                }
            });
    }

    DoSaveTitle() {
        this._lastProjectTitle = this.project._title;
        this._titleEditEnabled = false;
    }

    CancelTitle() {
        this.project._title = this._lastProjectTitle;
        this._titleEditEnabled = false;
    }

    SaveOverview() {
        this.project.validation.validate()
            .then(() => {
                this.DoSaveOverview();
                this.projectService.editProjectOverview(this.project);
            }).catch(error => {
                if (error.properties._overview.IsValid) {
                    this.DoSaveOverview();
                }
            });
    }

    DoSaveOverview() {
        this._lastProjectOverview = this.project._overview;
        this._overviewEditEnabled = false;
    }

    CancelOverview() {
        this.project._overview = this._lastProjectOverview;
        this._overviewEditEnabled = false;
    }

    SaveDescription() {
        this._lastProjectDescription = this.project._description;
        this._descrEditEnabled = false;
        this.projectService.editProjectDescription(this.project);
    }

    CancelDescription() {
        this.project._description = this._lastProjectDescription;
        this._descrEditEnabled = false;
    }

    TextAreaAdjust(event) {
        let element = event.srcElement;
        element.style.height = (element.scrollHeight) + "px";
    }

    Like() {
        let projectId = this.project._id;
        let projectService = this.projectService;

        projectService.like(this.project)
            .then(() => this.project.liked = !this.project.liked);
    }

    Join() {
        let projectId = this.project._id;
        let projectService = this.projectService;

        if (this.project.joined) {
            projectService.unjoin(this.project)
                .then(() => this.project.joined = !this.project.joined);
        } else {
            projectService.join(this.project)
                .then(() => this.project.joined = !this.project.joined);
        }
    }
}
