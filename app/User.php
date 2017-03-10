<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    public $table = 'users';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function loginUser ($username){
        $user = DB::table($this->table)->where('username', '=', $username)->first();

        if(isset($user)){
            if($user->date >= 0) {
                if ((time() - $user->date) > config('app.game.login_time')) {

                    DB::table($this->table)->where('id', $user->id)->update(['date' => time()]);

                    return [
                        'id' => $user->id,
                        'record' => $user->points
                    ];

                }else {
                    return false;
                }
            }else {
                return false;
            }

        }else {
            $id = DB::table('users')->insertGetId(
                ['username' => $username, 'date' => time()]
            );
            return [
                'id' => $id,
                'record' => 0
            ];
        }

    }

    public function logoutUser ($user_id) {
        DB::table($this->table)->where('id', $user_id)->update(['date' => 0]);
    }

    public function getWords(){
        return DB::table('words')->select('word')->inRandomOrder()->limit(50)->get();
    }
}
