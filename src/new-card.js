import {bindable} from "aurelia-framework";
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Project} from './models/project';
import {Router} from "aurelia-router";
import {Validation} from 'aurelia-validation';
import 'fetch';

@inject(HttpClient, Router, Validation)
export class NewCard {
    constructor(http, router, validation) {
        http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('/');
        });

        this.http = http;
        this.router = router;
        this.project = this.NewProject;

        this.validation = validation.on(this)
            .ensure('project._title')
            .isNotEmpty();
    }

    get NewProject() {
        return new Project({
            id: Math.floor(Math.random() * 10000) + 1,
            user: {
                login: "hakant",
                id: 1907367,
                avatar_url: "https://avatars.githubusercontent.com/u/1907367?v=3",
                name: "Hakan Tuncer"
            },
            title: "",
            liked: false,
            joined: false,
            overview: "",
            description: "",
            "like-count": 0,
            "team-count": 0
        });
    }

    attached() {
        var me = this;
        $("#new-card").modal('show');
        $('#new-card').on('hidden.bs.modal', function() {
            me.router.navigateToRoute('overview');
        });

        $("input.card-title").focus();
    }

    Save() {
        this.validation.validate()
            .then(() => {
                $("#new-card").modal('hide');
                window._projects.push(this.project);
                this.router.navigateToRoute('overview');
            }).catch(error => {
                
            });
    }

    Cancel() {
        $("#new-card").modal('hide');
        this.router.navigateToRoute('overview');
    }
}