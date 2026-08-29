import { dealService } from '../../src/services/dealService';
import { dealModel } from '../../src/models/Deal';

jest.mock('../../src/models/Deal');

describe('Deal Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new deal', async () => {
    const dealData = {
      title: 'Test Deal',
      value: 10000,
      status: 'prospecting',
      client_name: 'Test Client',
      owner_id: 'user-1',
      expected_close_date: new Date('2024-12-31'),
      probability: 50,
    };

    (dealModel.create as jest.Mock).mockResolvedValue(dealData);

    const result = await dealService.createDeal(dealData);

    expect(dealModel.create).toHaveBeenCalledWith(dealData);
    expect(result).toEqual(dealData);
  });

  it('should get deal by ID', async () => {
    const dealId = 'deal-1';
    const dealData = {
      id: dealId,
      title: 'Test Deal',
      value: 10000,
    };

    (dealModel.findById as jest.Mock).mockResolvedValue(dealData);

    const result = await dealService.getDeal(dealId);

    expect(dealModel.findById).toHaveBeenCalledWith(dealId);
    expect(result).toEqual(dealData);
  });

  it('should calculate pipeline correctly', async () => {
    const deals = [
      { id: '1', status: 'prospecting', value: 10000 },
      { id: '2', status: 'qualified', value: 20000 },
      { id: '3', status: 'won', value: 30000 },
    ];

    (dealModel.findAll as jest.Mock).mockResolvedValue(deals);

    const pipeline = await dealService.calculatePipeline();

    expect(pipeline.prospecting.count).toBe(1);
    expect(pipeline.prospecting.value).toBe(10000);
    expect(pipeline.qualified.count).toBe(1);
    expect(pipeline.won.count).toBe(1);
  });
});
