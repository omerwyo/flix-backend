import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import AppDataSource from '../index';
import { Title } from '../entities/Title';

const router = Router();

/******************************************************************************
 *      Get Line Chart - "GET /api/titles/line_chart"
 *      Returns a key value pair array of title_release_year: averageRuntime to be used in line chart
 *      Request body contains start_year and end_year
 ******************************************************************************/

 router.get('/line_chart', async (req: Request, res: Response) => {
    const titles = await AppDataSource
        .getRepository(Title)
        .createQueryBuilder("title")
        .select('title.release_year')
        .addSelect('AVG(title.runtime)', 'averageRuntime')
        .where('title.release_year between :start_year and :end_year', {start_year: req.body.start_year, end_year: req.body.end_year})
        .groupBy("title.release_year")
        .orderBy('title.release_year', 'ASC')
        .getRawMany();
    return res.status(OK).json({titles});
});

/******************************************************************************
 *      Get TV:Show Proportions as Percentages for a year - "GET /api/titles/proportion"
 *      Returns the following
 *      {movie_percent: 76.5, show_percent: 23.5}
 *      Request body contains release_year
 ******************************************************************************/

 router.get('/proportion', async (req: Request, res: Response) => {
    console.log(req.query.release_year)
    const occurrences = await AppDataSource
        .getRepository(Title)
        .createQueryBuilder("title")
        .select('title.type')
        .addSelect('COUNT(title.type)', 'occurrences')
        .where('title.release_year =:start_year', {start_year: Number(req.query.release_year)})
        .groupBy("title.type")
        .orderBy('title.type', 'ASC')
        .getRawMany();

    const movie_percent = Number(occurrences[0]["occurrences"])/(Number(occurrences[0]["occurrences"]) + Number(occurrences[1]["occurrences"])) * 100

    const show_percent = Number(occurrences[1]["occurrences"])/(Number(occurrences[0]["occurrences"]) + Number(occurrences[1]["occurrences"])) * 100

    const toRet = {movie_percent: Math.round(movie_percent * 10) / 10, 
                   show_percent: Math.round(show_percent* 10) / 10}
    return res.status(OK).json(toRet);
});

/******************************************************************************
 *                      Get All Titles - "GET /api/titles/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    console.log('reached')
    const titles = await AppDataSource
        .getRepository(Title)
        .createQueryBuilder("title")
        .getMany();
    return res.status(OK).json({titles});
});

/******************************************************************************
 *                      Get Title - "GET /api/titles/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const title = await AppDataSource
        .createQueryBuilder()
        .select("title")
        .from(Title, "title")
        .where("title.id = :id", { id: id })
        .getOne();
    if (!title) {
        res.status(404);
        res.end();
        return;
    }
    return res.status(OK).json({title});
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

 export default router;


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/
// router.post('/add', async (req: Request, res: Response) => {
//     const {
//         user
//     } = req.body;

//     if (!user) {
//         return res.status(BAD_REQUEST).json({
//             error: paramMissingError,
//         });
//     }
//     await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(User)
//         .values([
//             {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 age: user.age
//             }
//         ])
//         .execute();
//     return res.status(CREATED).end();
// });


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/
// router.put('/update', async (req: Request, res: Response) => {
//     const { user } = req.body;
//     if (!user && !user.id) {
//         return res.status(BAD_REQUEST).json({
//             error: paramMissingError,
//         });
//     }
//     await getConnection()
//         .createQueryBuilder()
//         .update(User)
//         .set({ 
//             firstName: user.firstName, 
//             lastName: user.lastName,
//             age: user.age
//         })
//         .where("id = :id", { id: user.id })
//         .execute();
//     return res.status(OK).end();
// });


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/
// router.delete('/delete/:id', async (req: Request, res: Response) => {
//     const { id } = req.params as ParamsDictionary;
//     await getConnection()
//         .createQueryBuilder()
//         .delete()
//         .from(User)
//         .where("id = :id", { id: id })
//         .execute();
//     return res.status(OK).end();
// });