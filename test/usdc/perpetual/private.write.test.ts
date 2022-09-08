import { API_ERROR_CODE, USDCPerpetualClient } from '../../../src';
import {
  successUSDCEmptyResponseObject,
  successUSDCResponseObject,
} from '../../response.util';

describe('Private Account Asset REST API Endpoints', () => {
  const useLivenet = true;
  const API_KEY = process.env.API_KEY_COM;
  const API_SECRET = process.env.API_SECRET_COM;

  it('should have api credentials to test with', () => {
    expect(API_KEY).toStrictEqual(expect.any(String));
    expect(API_SECRET).toStrictEqual(expect.any(String));
  });

  const api = new USDCPerpetualClient(API_KEY, API_SECRET, useLivenet);

  const symbol = 'BTCPERP';

  it('submitOrder()', async () => {
    expect(
      await api.submitOrder({
        symbol,
        side: 'Sell',
        orderType: 'Limit',
        orderFilter: 'Order',
        orderQty: '1',
        orderPrice: '20000',
        orderLinkId: Date.now().toString(),
        timeInForce: 'GoodTillCancel',
      })
    ).toMatchObject({
      retCode: API_ERROR_CODE.INSUFFICIENT_BALANCE_FOR_ORDER_COST,
    });
  });

  it('modifyOrder()', async () => {
    expect(
      await api.modifyOrder({
        symbol,
        orderId: 'somethingFake',
        orderPrice: '20000',
        orderFilter: 'Order',
      })
    ).toMatchObject({
      retCode: API_ERROR_CODE.ORDER_NOT_FOUND_OR_TOO_LATE,
    });
  });

  it('cancelOrder()', async () => {
    expect(
      await api.cancelOrder({
        symbol,
        orderId: 'somethingFake1',
        orderFilter: 'Order',
      })
    ).toMatchObject({
      retCode: API_ERROR_CODE.ORDER_NOT_FOUND_OR_TOO_LATE,
    });
  });

  it('cancelActiveOrders()', async () => {
    expect(await api.cancelActiveOrders(symbol, 'Order')).toMatchObject(
      successUSDCEmptyResponseObject()
    );
  });

  it('setMarginMode()', async () => {
    expect(await api.setMarginMode('REGULAR_MARGIN')).toMatchObject(
      successUSDCResponseObject()
    );
  });

  it('setLeverage()', async () => {
    expect(await api.setLeverage(symbol, '10')).toMatchObject({
      retCode: API_ERROR_CODE.LEVERAGE_NOT_MODIFIED,
    });
  });

  it('setRiskLimit()', async () => {
    expect(await api.setRiskLimit(symbol, 1)).toMatchObject({
      retCode: API_ERROR_CODE.RISK_LIMIT_NOT_EXISTS,
    });
  });
});
