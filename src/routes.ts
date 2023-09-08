import { Router } from 'express'
import multer from 'multer'

import { isAuthenticated } from './middlewares/isAuthenticated'

import uploadConfig from './config/multer'

import { AuthUserController } from './controllers/User/AuthUserController'
import { EditUserController } from './controllers/User/EditUserController'
import { GetUserController } from './controllers/User/GetUserController'
import { CreateUserController } from './controllers/User/CreateUserController'

import { ListTransactionsController } from './controllers/Transaction/ListTransactionsController'
import { ConfirmedTransactionController } from './controllers/Transaction/ConfirmedTransactionController'
import { CreateTransactionController } from './controllers/Transaction/CreateTransactionController'
import { EditTransactionController } from './controllers/Transaction/EditTransactionController'

import { ListClientsController } from './controllers/Client/ListClientsController'
import { ListClientsChairController } from './controllers/Client/ListClientsChairController'
import { CreateClientController } from './controllers/Client/CreateClientController'
import { EditClientController } from './controllers/Client/EditClientController'
import { DeleteClientController } from './controllers/Client/DeleteClientController'
import { GetClientController } from './controllers/Client/GetClientController'

import { ClientsCashController } from './controllers/Cash/ClientsCashController'
import { MoveCashController } from './controllers/Cash/MoveCashController'
import { ClearCashController } from './controllers/Cash/ClearCashController'
import { ExitClientCashController } from './controllers/Cash/ExitClientCashController'
import { BuyCashController } from './controllers/Cash/BuyCashController'
import { RewardCashController } from './controllers/Cash/RewardCashController'

import { ClientsTournamentController } from './controllers/Tournament/ClientsTournamentController'
import { MoveTournamentController } from './controllers/Tournament/MoveTournamentController'
import { ExitClientTournamentController } from './controllers/Tournament/ExitClientTournamentController'
import { BuyTournamentController } from './controllers/Tournament/BuyTournamentController'
import { RewardTournamentController } from './controllers/Tournament/RewardTournamentController'

const upload = multer(uploadConfig)

const router = Router()

// Routes Publics

router.post('/session', new AuthUserController().handle)
router.post('/user', new CreateUserController().handle)

router.use(isAuthenticated)

router.get('/user/:id', new GetUserController().handle)
router.put('/user', upload.single("file"), new EditUserController().handle)

router.get('/transactions', new ListTransactionsController().handle)
router.get('/confirmed-transaction/:id', new ConfirmedTransactionController().handle)
router.post('/transaction', new CreateTransactionController().handle)
router.put('/transaction/:id',  new EditTransactionController().handle)

router.get('/clients', new ListClientsController().handle)
router.get('/clients-chair', new ListClientsChairController().handle)
router.post('/client', upload.single("file"), new CreateClientController().handle)
router.put('/client/:client_id', upload.single("file"),  new EditClientController().handle)
router.get('/client/:client_id', new GetClientController().handle)
router.delete('/client/:client_id', new DeleteClientController().handle)

router.get('/clients-cash', new ClientsCashController().handle)
router.post('/move-cash', new MoveCashController().handle)
router.post('/buy-cash', new BuyCashController().handle)
router.post('/reward-cash', new RewardCashController().handle)
router.get('/clear-cash', new ClearCashController().handle)
router.delete('/exit-cash/:client_id', new ExitClientCashController().handle)

router.get('/clients-tournament', new ClientsTournamentController().handle)
router.post('/move-tournament', new MoveTournamentController().handle)
router.post('/buy-tournament', new BuyTournamentController().handle)
router.post('/reward-tournament', new RewardTournamentController().handle)
router.delete('/exit-tournament/:client_id', new ExitClientTournamentController().handle)


export { router }