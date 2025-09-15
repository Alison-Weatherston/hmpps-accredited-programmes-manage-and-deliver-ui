import AccreditedProgrammesManageAndDeliverService from "../services/accreditedProgrammesManageAndDeliverService";
import {Request, Response} from "express";
import ControllerUtils from "../utils/controllerUtils";
import ChangeCohortPresenter from "./changeCohortPresenter";
import ChangeCohortView from "./changeCohortView";
import AddAvailabilityForm from "../referralDetails/addAvailability/AddAvailabilityForm";
import ChangeCohortForm from "./changeCohortForm";

export default class CohortController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showChangeCohortPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'POST') {
      const data = await new ChangeCohortForm(req, referralId).data()
      await this.accreditedProgrammesManageAndDeliverService.updateCohort(username, referralId, data.paramsForUpdate.updatedCohort)
      return res.redirect(`/referral/${referralId}/update-cohort?isCohortUpdated=true`)
    }

    const presenter = new ChangeCohortPresenter(referralId, referralDetails, req.originalUrl)
    const view = new ChangeCohortView(presenter)

    ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
