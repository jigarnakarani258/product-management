const express = require('express')
const app = express();

const {globalErrController} = require('./controllers/errorController')
const {AppError} =require('./utility/appError')
const { userRouter } = require(`${__dirname}/routes/userRoutes.js`)
const { productRouter } = require('./routes/productRoutes');
const { categoryRouter } = require('./routes/categoryRoutes');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');
const bodyParser = require('body-parser')
const passport = require('passport');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use( express.json() );
app.use( (req , res , next) =>{
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1', userRouter)
app.use('/api/v1', productRouter)
app.use('/api/v1', categoryRouter)

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Product Management',
            description: `Product Management apps have various use cases across different stages.
                            In this app we manage user , prodct management.`
        },
        tags: [
            {
                name: 'User Management',
                description: 'User management related APIs .',
            },
            {
                name: 'Product Management',
                description: 'Product management related APIs .',
            }
        ],
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        basePath: '/api/v1',
    },
    apis: [
        "./routes/userRoutes.js",
        "./routes/productRoutes.js",
        "./routes/categoryRoutes.js"
    ]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//set local variable with request for user-role based permission
app.use((req, res, next)=>{
    req.app.locals = {
        pemission_flag : false,
        pemission_message : ''
    } ;
    next();
  });

//passport authentication 
app.use(passport.initialize());
require(`${__dirname}/utility/passport.js`)


//here app.all use for all method(get,post,put,delete)
app.all('*',(req,res,next)=>{
    let err = {
        name : 'customPathError',
        message : `Can not find route ${req.originalUrl} on this server, Please check API route.`
    }
    return next(new AppError(err, 404));
})

//Global error Middleware
app.use(globalErrController)

module.exports = app;
