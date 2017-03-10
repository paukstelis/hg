<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    public function login (Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {
            $username = $request->input('username');

            if(strlen($username) >= 3 and $username <= 30 and !preg_match_all('/[^A-z0-9_-]/', $username)) {
                $user = new User();
                $check = $user->loginUser($username);
                if($check){
                    $word = $user->getWords();
                    $d = [
                        'words' => $word,
                        'user' => $check
                    ];
                    return response()->json($d, 200);
                }else {
                    return response()->json('Invalid Username', 400);
                }
            }else {
                return response()->json('Invalid Username', 400);
            }
        }else {
            return response()->json('Bad Request', 400);
        }
    }

    public function userInfo(Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {
            return response()->json(User::find((int)$request->input('user_id')));
        }else {
            return response()->json('Bad Request', 400);
        }
    }


    public function logout(Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {
            $user = new User();
            $user->logoutUser($request->input('user_id'));
            return response()->json('ok');
        }
    }

    public function userTop (Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {

            $item_per_page = 10;

            $page = (int)$request->input('page');
            $start = ($page - 1) * $item_per_page;

            return response()->json(
                DB::table('users')
                ->select('points', 'username')
                ->orderBy('points', 'desc')
                ->offset($start)
                ->limit($item_per_page)
                ->get()
            );
        }
    }

    public function record (Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {

            $record  = (int)$request->input('record');
            $user_id = $request->input('user_id');

            DB::table('users')->where('id', $user_id)->update(['points' => $record]);
        }
    }

    public function word (Request $request){
        if(config('app.custom.ip') == request()->server('SERVER_ADDR')) {
            $words = new User();
            return $words->getWords();
        }
//        $faker = \Faker\Factory::create();
//        return $faker->word;
    }
}
