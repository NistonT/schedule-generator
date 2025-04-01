import { Controller } from '@nestjs/common';
import { AmountLimitsService } from './amount_limits.service';

@Controller('amount-limits')
export class AmountLimitsController {
  constructor(private readonly amountLimitsService: AmountLimitsService) {}
}
