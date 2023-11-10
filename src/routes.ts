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
import { ListProductsController } from './controllers/Product/ListProductsController'
import { DeleteProductController } from './controllers/Product/DeleteProductController'
import { EditProductController } from './controllers/Product/EditProductController'
import { CreateProductController } from './controllers/Product/CreateProductController'
import { CreateUserClubController } from './controllers/User/CreateUserClubController'
import { EditUserClubController } from './controllers/User/EditUserClubController'
import { ListUsersClubController } from './controllers/User/ListUsersClubController'
import { DeleteUserClubController } from './controllers/User/DeleteUserClubController'
import { CreateOrderController } from './controllers/Order/CreateOrderController'
import { ListOrdersController } from './controllers/Order/ListOrdersController'
import { GetOrderController } from './controllers/Order/GetOrderController'
import { GetProductController } from './controllers/Product/GetProductController'
import { CreateTournamentController } from './controllers/Tournament/CreateTournamentController'
import { EditTournamentController } from './controllers/Tournament/EditTournamentController'
import { ListTournamentsController } from './controllers/Tournament/ListTournamentsController'
import { GetTournamentController } from './controllers/Tournament/GetTournamentController'
import { AddTournamentController } from './controllers/Tournament/AddTournamentController'
import { FinishTournamentController } from './controllers/Tournament/FinishTournamentController'
import { InitialTournamentController } from './controllers/Tournament/InitialTournamentController'
import { EndRegisterTournamentController } from './controllers/Tournament/EndRegisterTournamentController'
import { ListPassportController } from './controllers/Transaction/ListPassportController'
import { ListJackpotController } from './controllers/Transaction/ListJackpotController'
import { ConfirmedJackpotController } from './controllers/Transaction/ConfirmedJackpotController'
import { ConfirmedDealerController } from './controllers/Transaction/ConfirmedPassportController'
import { StructureTournamentController } from './controllers/Tournament/StructureTournamentController'
import { ListDealerController } from './controllers/Transaction/ListDealerController'
import { ConfirmedPassportController } from './controllers/Transaction/ConfirmedDealerController'
import { CreateCashController } from './controllers/Cash/CreateCashController'
import { EndCashController } from './controllers/Cash/EndCashController'
import { GetCashController } from './controllers/Cash/GetCashController'
import { CreateMethodController } from './controllers/Method/CreateMethodController'
import { EditMethodController } from './controllers/Method/EditMethodController'
import { ListMethodsController } from './controllers/Method/ListMethodsController'
import { DeleteMethodController } from './controllers/Method/DeleteMethodController'
import { CreateCategoryController } from './controllers/Category/CreateCategoryController'
import { EditCategoryController } from './controllers/Category/EditCategoryController'
import { ListCategoriesController } from './controllers/Category/ListCategoriesController'
import { DeleteCategoryController } from './controllers/Category/DeleteCategoryController'
import { GetReportController } from './controllers/Report/GetReportController'

const upload = multer(uploadConfig)

const router = Router()

// Routes Publics

router.post('/session', new AuthUserController().handle)

router.use(isAuthenticated)

router.get('/transactions', new ListTransactionsController().handle)
router.get('/jackpots', new ListJackpotController().handle)
router.get('/passports', new ListPassportController().handle)
router.get('/dealers', new ListDealerController().handle)
router.put('/confirmed-transaction/:id', new ConfirmedTransactionController().handle)
router.put('/confirmed-jackpot/:id', new ConfirmedJackpotController().handle)
router.put('/confirmed-passport/:id', new ConfirmedPassportController().handle)
router.put('/confirmed-dealer/:id', new ConfirmedDealerController().handle)
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

router.get('/clients-tournament/:tournament_id', new ClientsTournamentController().handle)
router.post('/add-tournament', new AddTournamentController().handle)
router.post('/move-tournament', new MoveTournamentController().handle)
router.get('/tournament/:tournament_id', new GetTournamentController().handle)
router.get('/tournaments', new ListTournamentsController().handle)
router.put('/tournament/:tournament_id', new EditTournamentController().handle)
router.put('/structure-tournament/:tournament_id', new StructureTournamentController().handle)
router.post('/tournament', new CreateTournamentController().handle)
router.post('/buy-tournament', new BuyTournamentController().handle)
router.post('/reward-tournament', new RewardTournamentController().handle)
router.put('/exit-tournament/:client_id', new ExitClientTournamentController().handle)

router.put('/end-register/:tournament_id', new EndRegisterTournamentController().handle)
router.put('/initial-tournament/:tournament_id', new InitialTournamentController().handle)
router.put('/finish-tournament/:tournament_id', new FinishTournamentController().handle)

router.post('/product', upload.single("file"), new CreateProductController().handle)
router.put('/product/:product_id', upload.single("file"),  new EditProductController().handle)
router.get('/product/:product_id', new GetProductController().handle)
router.get('/products', new ListProductsController().handle)
router.delete('/product/:product_id', new DeleteProductController().handle)

router.post('/user', new CreateUserClubController().handle)
router.put('/user/:user_id',  new EditUserClubController().handle)
router.get('/users', new ListUsersClubController().handle)
router.delete('/user/:user_id', new DeleteUserClubController().handle)

router.post('/order', new CreateOrderController().handle)
router.get('/order/:order_id', new GetOrderController().handle)
router.get('/orders', new ListOrdersController().handle)

router.post('/cash', new CreateCashController().handle)
router.put('/cash/:cash_id', new EndCashController().handle)
router.get('/cash', new GetCashController().handle)

router.post('/method', new CreateMethodController().handle)
router.put('/method/:method_id',  new EditMethodController().handle)
router.get('/methods', new ListMethodsController().handle)
router.delete('/method/:method_id', new DeleteMethodController().handle)

router.post('/category', new CreateCategoryController().handle)
router.put('/category/:category_id',  new EditCategoryController().handle)
router.get('/categories', new ListCategoriesController().handle)
router.delete('/category/:category_id', new DeleteCategoryController().handle)

router.post('/reports', new GetReportController().handle)

export { router }