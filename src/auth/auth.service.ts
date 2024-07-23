import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
    constructor(private usersService:UsersService){}
    async registerLocal(profile:any){
        const user = await this.usersService.getUser(profile.email)
        if(user){
            return {
                msg:'User With This Email Is Registered'
            }
        }else{
            if(profile.password_1 === profile.password_2){
                const service = this.usersService
                bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function(err, salt) {
                    bcrypt.hash(profile.password_1, salt, async function(err, hash) {
                        console.log(hash)
                        console.log(profile.password_1)
                        const user = await service.createUser(profile,hash)
                        return user
                    });
                });
            }else{
                return {
                    msg:'Passwords Do Not Match'
                }
            }
        }
    }
    async validateLocal(email:string,password:string){
        const user = await this.usersService.getUser(email)
        let isValid = false
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                    isValid = true
                }else{
                    isValid = false
                }
            });
            if(!isValid){
                return user
            }else{
                return null
            }
        }
    }
    async validateGoogle(profile:any){
        const user = await this.usersService.getUser(profile.emails[0].value)
        if(user){
            return user
        }else{
            const user = await this.usersService.createUser({
                nickname:profile.emails[0].value,
                email:profile.emails[0].value,
                first_name:'',
                last_name:'',
                phone:'',
                isGoogle:true
            },null)
            return user
        }
    }
}