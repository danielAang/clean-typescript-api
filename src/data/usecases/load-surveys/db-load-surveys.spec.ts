import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

interface SutTypes {
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
  test('Should call LoadSurveysRepository', async () => {
    const { sut, dbLoadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(dbLoadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
