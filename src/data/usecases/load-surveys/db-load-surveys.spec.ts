import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  dbLoadSurveysRepositoryStub: LoadSurveysRepository
}

const makeDbLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class DbLoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new DbLoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const dbLoadSurveysRepositoryStub = makeDbLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(dbLoadSurveysRepositoryStub)
  return {
    sut,
    dbLoadSurveysRepositoryStub
  }
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          img: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          img: 'other_image',
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ]
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, dbLoadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(dbLoadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, dbLoadSurveysRepositoryStub } = makeSut()
    jest.spyOn(dbLoadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
