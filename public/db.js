const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "D:\\test\\test.db",
})
const App = sequelize.define('app', {
    packageName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    appName: DataTypes.STRING,
    versionCode: DataTypes.NUMBER,
    versionName: DataTypes.STRING,
    iconPath: DataTypes.STRING,
    apkPath: DataTypes.STRING,
}, {
    underscored: true,
    freezeTableName: true,
});

class Database {
    constructor() {
        this.init()
    }

    async init() {
        try {
            await sequelize.sync();
            await App.create({ packageName: 'com.tencent.mm', appName: '微信', versionCode: 123, versionName: '1.0.0', iconPath: 'D:\\test\\test.db', apkPath: 'D:\\test\\test.db' })
        } catch (e) {
            console.error(e.message)
        }
    }

    async saveApp(appInfo) {
        this.data.push(item);
    }

    async findApp(packageName) {
        return this.data.find(d => d.id === id);
    }
}

module.exports = Database