import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const getStoryScriptApi = async (summaryId: number): Promise<DocentScript> => {
  //TODO 더미 제거
  return {
    docentUrl: "summaryId",
    script:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa id impedit quas quasi vel voluptate! Architecto aut commodi dolorum, et exercitationem explicabo laborum minus omnis porro quaerat, qui sit vero?",
  };
  try {
    const response = await api.get<BaseResponse<DocentScript>>(
      `${API_ENDPOINTS.STORY.DOCENT_SCRIPT}`,
      { params: { summaryId: summaryId } },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

interface DocentScript {
  docentUrl: string;
  script: string;
}

export default getStoryScriptApi;
