<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
  return view('index');
});

Route::post('login', 'UsersController@login');
Route::post('logout', 'UsersController@logout');
Route::post('user_info', 'UsersController@userInfo');
Route::post('top', 'UsersController@userTop');
Route::post('record', 'UsersController@record');
Route::get('word', 'UsersController@word');