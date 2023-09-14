const { validateUserType } = require("../lib/validateUserType");
const { UserModels } = require("../models/users.models");
const { catchedAsync } = require("../utils/catchedAsync");
const { response } = require("../utils/response");
require("dotenv").config();

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModels.postLogin(email, password);
    return res.header("token", user.token).status(200).json({
        result: user.result,
        token: user.token,
    });
}

class UserController {
    static async register(req, res) {
        const { name, lastName, date, password, email } = req.body;
        const user = await UserModels.register(
            name,
            lastName,
            date,
            password,
            email
        );
        response(res,user.status,user.data)
    }
    static async postLogin(req, res) {
        const { email, password } = req.body;
        const user = await UserModels.postLogin(email, password);
        if (typeof user === "string") return res.status(401).send(user);
        return res.header("token", user.token).status(200).json({
            result: user.result,
            token: user.token,
        });
    }
    static async getImage(req, res) {
        const { user } = req;
        const img = await UserModels.getImage(user.id);
        response(res,200,img)
    }
    static async getImageLarge(req, res) {
        const { userId } = req.params;
        const img = await UserModels.getImageLarge(userId);
        res.status(200).send(img);
    }
    static async getUserById(req, res) {
        const { idUser } = req.params;
        const user = await UserModels.getUserById(idUser);
        res.status(200).send(user);
    }
    static async getPasByRoute (req,res) {
        const {route} = req.params
        const pas = await UserModels.getPasByRoute(route);
        res.status(200).send(pas)
    }
    static async getPasById (req,res) {
        const {id} = req.params
        const pas = await UserModels.getPasById(id);
        res.status(200).send(pas)
    }
    static async updateTypeUser(req, res) {
        const { type, idUser } = req.params;
        const { user } = req;
        const validate = validateUserType(user.type);
        const pas = await UserModels.updateTypeUser(type, idUser, validate);
        res.status(200).send(pas);
    }
    static async getPasUser(req, res) {
        const { page } = req.params;
        const numberPage = parseInt(page);
        const allPas = await UserModels.getPasUser(numberPage);
        res.status(200).send(allPas);
    }
    static async getAllUsers(req, res) {
        const { page } = req.params;
        const numberPage = parseInt(page);
        const allPas = await UserModels.getAllUsers(numberPage);
        res.status(200).send(allPas);
    }
    static async getStatusPas(req, res) {
        const { estatus, idUser } = req.params;
        const { user } = req;
        const validate = validateUserType(user.type);
        const status = await UserModels.getStatusPas(estatus, idUser, validate);
        res.status(200).send(status);
    }
    static async searchUserByEmail(req, res) {
        const { email } = req.params;
        const { user } = req;
        const validate = validateUserType(user.type);
        if (!validate) return res.status(401).send("Access Denied");
        const result = await UserModels.searchUserByEmail(email);
        res.status(200).send(result);
    }
    static async myPersonalData(req, res) {
        const { user } = req;
        const result = await UserModels.myPersonalData(user.id, user.type);
        res.status(200).send(result);
    }
    static async updateUserInfo(req, res) {
        const { users } = req.body;
        const { user } = req;
        const result = await UserModels.updateUserInfo(users, user);
        res.status(200).send(result);
    }
    static async getClientsOfPas(req, res) {
        const { idPas } = req.params;
        const result = await UserModels.getClientsOfPas(idPas);
        res.status(200).send(result);
    }
    static async getAllRoutes(req, res) {
        const result = await UserModels.getAllRoutes(req.params.id);
        res.status(200).send(result);
    }
    static async getPasInfo (req, res) {
        const {idPas} = req.params;
        const data = await UserModels.getPasInfo(idPas);
        res.json(data)        
    }
}

module.exports = {
    UserController,
    postLogin:catchedAsync(postLogin)
};
