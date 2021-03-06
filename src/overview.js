import {inject} from 'aurelia-framework';
import {computedFrom} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {ProjectService} from './services/project-service';
import {TooltipService} from './services/tooltip-service';

import 'fetch';

@inject(HttpClient, ProjectService, TooltipService)
export class Overview {
    _projects = [];

    constructor(http, projectService, tooltipService) {
        http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('/');
        });

        this.http = http;
        this.tooltipService = tooltipService;
        this.projectService = projectService;

        this.projectService.getProjects()
            .then(p => this._projects = p);
    }

    @computedFrom('_projects')
    get projects() {
        return this._projects;
    }
    
    attached(){
        this.tooltipService.DisplayForPage("Overview");    
    }

    refresh(){
        this.projectService.getProjects()
            .then(p => this._projects = p);
    }
}
