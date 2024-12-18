const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const donationRoute = require('./routes/donation.route');
const campaignRoute = require('./routes/campaign.route');
const propertyRoute = require('./routes/property.route');
const installmentRoute = require('./routes/installment.route');
const installmentPlanRoute = require('./routes/installmentPlan.route');
const coOwnershipPlanRoute = require('./routes/coOwnershipPlan.route');
const contractRoute = require('./routes/contract.route');
const invoiceRoute = require('./routes/invoice.route');
const caseRoute = require('./routes/case.route');
const globalHandler = require('./controllers/error.controller');
const xss = require('xss-clean');
const path = require('path');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yml'));



const app = express();

app.use(
  session({
    secret: 'Poll',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors({
  origin: '*',
  credentials: true,
}));



app.use(helmet());

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true }));

// Data sanitization against XSS
app.use(xss());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/campaign', campaignRoute)
app.use('/api/v1/property', propertyRoute)
app.use('/api/v1/installment', installmentRoute)
app.use('/api/v1/installmentPlan', installmentPlanRoute)
app.use('/api/v1/coOwnershipPlan', coOwnershipPlanRoute)
app.use('/api/v1/contract', contractRoute)
app.use('/api/v1/invoice', invoiceRoute)

app.use('/api/v1/donation', donationRoute);

app.use('/api/v1/case', caseRoute);


app.use(globalHandler);

app.get('/', (req, res) => {
  res.send(' Server live 🔥🔥️');
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    messsage: `${req.originalUrl} not found`,
  });
});

module.exports = app;