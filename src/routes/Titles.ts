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
        .addSelect('ROUND(AVG(title.runtime), 1)', 'averageRuntime')
        .where('title.release_year between :start_year and :end_year', {start_year: Number(req.query.start_year), end_year: Number(req.query.end_year)})
        .groupBy("title.release_year")
        .orderBy('title.release_year', 'ASC')
        .getRawMany();
    res.set('Access-Control-Allow-Origin', 'https://flix-omerwyo.azurewebsites.net');
    return res.status(OK).json({titles});
});

/******************************************************************************
 *      Get TV:Show Proportions as Percentages for a year - "GET /api/titles/proportion"
 *      Returns the following
 *      {movie_percent: 76.5, show_percent: 23.5}
 *      Request body contains release_year
 ******************************************************************************/

 router.get('/proportion', async (req: Request, res: Response) => {
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
    res.set('Access-Control-Allow-Origin', 'https://flix-omerwyo.azurewebsites.net');
    return res.status(OK).json(toRet);
});

/******************************************************************************
 *      Get occurrence of AGE_CERTIFICATION for a given genre - "GET /api/titles/age"
 *      Returns the following
 *      Returns a key value pair array of age_certification: occurrences to be used in line chart
 *      Request body contains genre string
 ******************************************************************************/

 router.get('/age', async (req: Request, res: Response) => {
    var lowerCaseGenre = String(req.query.genre).toLowerCase()
    const CertNumMapping = {"TV-Y7": 0, "G": 1, "NC-17": 2, "TV-Y": 3, "PG": 4, "TV-G": 5, "TV-PG": 6, "TV-14": 7, "PG-13": 8, "R": 9, "TV-MA": 10};
    const foundKeys = new Set<string>();
    const ages = await AppDataSource
        .getRepository(Title)
        .createQueryBuilder("title")
        .select('title.age_certification')
        .addSelect('COUNT(title.age_certification)', 'occurrences')
        .where("title.genres like :genre", { genre:`%${lowerCaseGenre}%` })
        .andWhere("title.age_certification is not null")
        .groupBy("title.age_certification")
        .orderBy('title.age_certification', 'ASC')
        .getRawMany();
        for(let i=0; i<ages.length; i++){foundKeys.add(ages[i].title_age_certification);}
        for (let key in CertNumMapping){
            if (!foundKeys.has(key)){
                ages.push({'title_age_certification': key, 'occurrences': "0"})
            }
        }
        ages.sort(function(a, b) {
            var keyA = new String(a.title_age_certification),
              keyB = new String(b.title_age_certification);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
    res.set('Access-Control-Allow-Origin', 'https://flix-omerwyo.azurewebsites.net');
    return res.status(OK).json({ages});
});

/******************************************************************************
 *                      Get All Titles - "GET /api/titles/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const titles = await AppDataSource
        .getRepository(Title)
        .createQueryBuilder("title")
        .getMany();
    res.set('Access-Control-Allow-Origin', 'https://flix-omerwyo.azurewebsites.net');
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
    res.set('Access-Control-Allow-Origin', 'https://flix-omerwyo.azurewebsites.net');
    return res.status(OK).json({title});
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

 export default router;