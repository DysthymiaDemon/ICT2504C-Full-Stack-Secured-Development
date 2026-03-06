module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define("Movie", {
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        synopsis: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        director: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        releaseDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: true
        }
    }, {
        tableName: 'movies'
    });
    return Movie;
}
