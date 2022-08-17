import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient,  } from '@angular/common/http';
import { User } from '../_models';
import db from "./demo.db";
import { from } from 'rxjs'
@Injectable()
export class BackendService {

  ds: any;

  constructor(private http: HttpClient,
    private location: Location) {
    this.ds = Object.assign({}, db) || {}
  }
  getModel(action) {
    if (action.includes('?') && action.includes('/')) {
      return action.indexOf('?') > action.indexOf('/') ? action.substring(0, action.indexOf('/')) : action.substring(0, action.indexOf('?'))
    } else {
      return action.includes('?') ? action.substring(0, action.indexOf('?')) : action.substring(0, action.indexOf('/'))
    }
  }

  getId(action, model) {
    action = action.substr(model.length + 1)
    return action.length > 0 && (action.includes('?') ? action.substring(0, action.indexOf('?')) : action)
  }

  getExpand(action, model) {
    action = action.substr(action.indexOf('?'))
    return action.includes('_expand') ? (
      action.includes('&') ?
        action.substring('_expand='.length + 1, action.indexOf('&')) :
        action.substring('_expand='.length + 1)) : undefined
  }

  getEmbed(action) {
    return action.includes('?') ? action.substring(action.indexOf('/'), action.indexOf('?')) : action.substring(action.indexOf('/'))
  }

  getData(action: any) {
    const self = this
    return new Promise(function (resolve, reject) {
      const model = self.getModel(action)
      const idStr = self.getId(action, model)
      const id = isNaN(idStr) ? undefined : parseInt(idStr)
      let exp = self.getExpand(action, model)
      const expandModel = exp ? exp === "category" ? "categories" : exp + "s" : exp
      const embed = self.getEmbed(action)
      let result
      let expand, expandId
      if (model in self.ds) {
        if (id) {
          result = self.ds[model][self.ds[model].findIndex(d => d.id === id)]

          if (expandModel) {
            expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
            expandId = result[expand + "Id"]
            result[expand] = self.ds[expandModel][self.ds[expandModel].findIndex(d => d.id === expandId)]
          }
        } else {
          result = self.ds[model].map(m => {
            if (expandModel) {
              expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
              expandId = m[expand + "Id"]
              m[expand] = self.ds[expandModel][self.ds[expandModel].findIndex(d => d.id === expandId)]
            }
            return m
          })
        }
      }
      setTimeout(resolve, 200, { data: result })
    });
  }


  getAll(action: any) {
    return from(this.getData(action))
  }

  getByQuery(action: any) {
    return from(this.getData(action))
  }

  getById(action: any) {
    return from(this.getData(action))
  }

  create(action: any, data: any) {
    return from(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      data.id = this.ds[model] + 1
      this.ds[model].push(data)
      setTimeout(resolve, 200, { data: data })
    }))
  }

  update(action: any, data: any) {
    return from(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      const idx = this.ds[model].findIndex(d => d.id === data.id)
      this.ds[model][idx] = Object.assign({}, data)
      setTimeout(resolve, 200, { data: data })
    }))

  }

  delete(action: any) {
    return from(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      const id = this.getId()
      id && this.ds[model].splice(this.ds[model].findIndex(d => d.id === id))
      setTimeout(resolve, 200, { status: 200 })
    }))
  }

  login(action: any, user: User) {
    const self = this;
    return from(new Promise(function (resolve, reject) {
      const { access_token, user } = self.ds.token
      setTimeout(resolve, 200, {
        access_token,
        user
      })
    }));
  }
}
