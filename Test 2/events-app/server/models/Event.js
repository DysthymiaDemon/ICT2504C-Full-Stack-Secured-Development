module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT,
        },
        eventDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tablename: "events"
    });
    return Event;
}
