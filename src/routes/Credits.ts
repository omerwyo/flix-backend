import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import AppDataSource from '../index';
import { Credit } from "../entities/Credit";

// Init shared
const router = Router();


/******************************************************************************
 *                      Get All Credits - "GET /api/credits/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const credits = await AppDataSource
        .getRepository(Credit)
        .createQueryBuilder("credit")
        .getMany();
    return res.status(OK).json({credits});
});

/******************************************************************************
 *                      Get Credit - "GET /api/credits/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const credit = await AppDataSource
        .createQueryBuilder()
        .select("credit")
        .from(Credit, "credit")
        .where("credit.id = :id", { id: id })
        .getOne();
    if (!credit) {
        res.status(404);
        res.end();
        return;
    }
    return res.status(OK).json({credit});
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