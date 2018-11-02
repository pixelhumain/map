<?php
/**
 * DefaultController.php
 *
 * OneScreenApp for Communecting people
 *
 * @author: Tibor Katelbach <tibor@pixelhumain.com>
 * Date: 14/03/2014
 */
class DefaultController extends CommunecterController {


  protected function beforeAction($action)
	{
    //parent::initPage();
	  return parent::beforeAction($action);
	}

	public function actionIndex() 
	{

    //echo "hello there"; exit ;
  	// if(Yii::app()->request->isAjaxRequest)
   //    echo $this->renderPartial("index");
   //  else
   //  {
   //    $this->layout = "//layouts/directory";
   //    $this->render("index");
   //  }

    if(Yii::app()->request->isAjaxRequest)
        echo $this->renderPartial("index");
      else{
        $this->layout = "//layouts/directory";
        echo $this->render("index");
      }
  }

  public function actionDoc() 
  {
      echo file_get_contents('../../modules/'.$this->module->id.'/README.md');
  }

}
