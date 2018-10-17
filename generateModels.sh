#!/bin/bash
sequelize model:create --name Wallpaper --attributes url:string
sequelize model:create --name User --attributes name:string,username:string,password:string,avatar:string,email:string,status:boolean,id_device:string
sequelize model:create --name List --attributes name:string,status:boolean
sequelize model:create --name Task --attributes finish_date:date,title:string,status:boolean,dead_line:date
