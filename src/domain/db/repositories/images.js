/*
    Images repository: app logo gallery stored as BLOBs.
*/
export function createImagesRepository(db) {
    return {
        addImage(imageData) {
            const sql = db.prepare(`
                    INSERT INTO images (image,current_image)
                    VALUES (?,?)
                `);
            const data = sql.run(imageData.image, 0);
            return data.lastInsertRowid;
        },

        setImage(imageState) {
            const reset = db.prepare(`
                    UPDATE images
                    SET
                        current_image = 0
                    WHERE
                        current_image = 1;
                `);
            reset.run();

            const sql = db.prepare(`
                    UPDATE images
                    SET
                        current_image = ?
                    WHERE
                        id = ?;
                `);
            const data = sql.run(imageState.current_image,
                imageState.id);
            return data.lastInsertRowid;
        },

        getImages() {
            const sql = db.prepare(`SELECT * FROM images`);
            const data = sql.all();
            return data;
        },

        getCurrentImage() {
            const sql = db.prepare(`SELECT * FROM images WHERE current_image = 1`);
            const data = sql.get();
            return data;
        },

        deleteImageById(id) {
            const sql = db.prepare(`DELETE FROM images WHERE id = ?`);
            const image = sql.run(id);
            return image;
        },
    };
}
