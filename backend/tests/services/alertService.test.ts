import { alertService } from '../../src/services/alertService';
import { dealModel } from '../../src/models/Deal';
import { alertModel } from '../../src/models/Alert';

jest.mock('../../src/models/Deal');
jest.mock('../../src/models/Alert');

describe('Alert Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check deals for approaching deadline', async () => {
    const deal = {
      id: 'deal-1',
      title: 'Test Deal',
      status: 'prospecting',
      expected_close_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      updated_at: new Date(),
      probability: 50,
    };

    (dealModel.findAll as jest.Mock).mockResolvedValue([deal]);
    (alertModel.findByDealId as jest.Mock).mockResolvedValue([]);
    (alertModel.create as jest.Mock).mockResolvedValue({
      id: 'alert-1',
      deal_id: 'deal-1',
      type: 'approaching_deadline',
    });

    await alertService.checkAllDeals();

    expect(dealModel.findAll).toHaveBeenCalled();
    expect(alertModel.create).toHaveBeenCalled();
  });

  it('should detect stalled deals', async () => {
    const deal = {
      id: 'deal-1',
      title: 'Stalled Deal',
      status: 'prospecting',
      expected_close_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      probability: 50,
    };

    (dealModel.findAll as jest.Mock).mockResolvedValue([deal]);
    (alertModel.findByDealId as jest.Mock).mockResolvedValue([]);
    (alertModel.create as jest.Mock).mockResolvedValue({
      id: 'alert-1',
      deal_id: 'deal-1',
      type: 'stalled',
    });

    await alertService.checkAllDeals();

    expect(alertModel.create).toHaveBeenCalled();
  });
});
